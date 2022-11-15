import {promises as fs} from 'fs';
import JSZip from 'jszip';
import axios from 'axios';
import constants from './constants';
import cultureMap from './cultures/cultureMap';
import YumError from "./error/YumError";
import IPart from "./parts/IPart";
import IPartConstructor from "./parts/IPartConstructor";
import partMap from "./parts/partMap";
import ITagConstructor from "./tags/ITagConstructor";
import tagMap from "./tags/tagMap";
import expressionEngine from "./tags/expressionEngine";
import { saveAs } from "./polyfills/File";
import { isNodeJS } from "./polyfills/polyfillsUtils";
import ICulture from "./cultures/ICulture";
import OpenXMLContentTypes from "./OpenXMLContentTypes";

type OptionsType = {
    delimiters? : {
        start? : string,
        end? : string
    },
    locale?: string
}

/**
 * YumTemplate
 */
class YumTemplate {
    private readonly _options: OptionsType;
    private readonly _parts: Map<string, IPart>;
    private _zip: JSZip;
    private _rendered: boolean;

    // ----------------------------------
    // Cultures
    // ----------------------------------
    static registerCulture(locale: string, culture: ICulture) {
        // Note: a registered culture can be replaced
        cultureMap.set(locale, culture);
    }

    // ----------------------------------
    // Parts
    // ----------------------------------
    // static registerPart(name: string, Part: typeof AbstractPart) {
    static registerPart(name: string, Part: IPartConstructor) {
        // Note: a registered part can be replaced
        partMap.set(name, Part);
    }

    // ----------------------------------
    // Tags
    // ----------------------------------
    // static registerTag(name: string, Tag: typeof AbstractTag) {
    static registerTag(name: string, Tag: ITagConstructor) {
        // Note: a registered tag can be replaced
        tagMap.set(name, Tag);
    }

    // ----------------------------------
    // Expression Engine
    // ----------------------------------
    static setExpressionEval(evaluate: (expression: string, context: Record<string, unknown>) => Promise<unknown>) {
        expressionEngine.setEval(evaluate)
    }

    /**
     * constructor
     * @param options
     */
    constructor(options: OptionsType = {}) {
        this._options = this._sanitizeOptions(options);
        this._parts = new Map();
        this._zip = new JSZip();
        this._rendered = false;
    }

    /**
     * _sanitizeOptions
     * @param options
     * @private
     */
    private _sanitizeOptions(options: OptionsType = {}) {
        return {
            delimiters: {
                start: options.delimiters?.start || constants.delimiters.start,
                end: options.delimiters?.start || constants.delimiters.end,
            },
            locale: options.locale || constants.locale
        };
    }

    /**
     * _loadNodePath
     * @param path
     * @private
     */
    private async _loadNodePath(path: string) {
        try {
            const handle = await fs.readFile(path);
            this._zip = await JSZip.loadAsync(handle);
        } catch (error) {
            if (Object.prototype.hasOwnProperty.call(error, 'syscall')) {
                throw new YumError(1010, {data: {path}, error});
            } else if ((<Error>error).message.startsWith('Can\'t find end of central directory')) {
                throw new YumError(1011, {data: {path}, error});
            } else {
                throw new YumError(1012, {data: {path}, error});
            }
        }
    }

    /**
     * _loadWithAxios
     * @param options
     * @private
     */
    private async _loadWithAxios(options: Record<string, unknown>) {
        try {
            // Force get
            options.method = 'get';
            // Force blob
            options.responseType = 'blob';
            const response = await axios(options);
            this._zip = await JSZip.loadAsync(response.data);
        } catch(error) {
            throw new YumError(1013, { error });
        }
    }

    /**
     * _loadAnythingElse
     * @param handle
     * @private
     */
    private async _loadAnythingElse(handle: unknown) {
        try {
            // Unfortunately, JSZip does not export InputFileFormat
            // @ts-expect-error TS2345: Argument of type 'unknown' is not assignable to parameter of type 'InputFileFormat'.
            this._zip = await JSZip.loadAsync(handle);
        } catch(error) {
            throw new YumError(1014, { error });
        }
    }

    /**
     * load
     * @param handle
     */
    async load(handle: unknown) {
        this._rendered = false;
        this._parts.clear();
        // Reset JSZip if called twice?
        if (isNodeJS && typeof handle === 'string') {
            await this._loadNodePath(<string>handle);
        } else if (Object.prototype.toString.call(handle) === '[object Object]') {
            await this._loadWithAxios(<Record<string, unknown>>handle);
        } else {
            await this._loadAnythingElse(handle);
        }
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown> = {}): Promise<string | undefined> {
        if (this._parts.size !== 0) throw new YumError(1005);
        if (this._rendered) throw new YumError(1006);
        this._rendered = true;
        let ret: string | undefined;
        // Load xml files into Parts including xml dom
        const contentTypes = new OpenXMLContentTypes(this._zip, this._options);
        await contentTypes.loadParts(this._parts);
        // Priority in increasing order (1 is highest, 10 is lowest)
        const parts = Array.from(this._parts.values())
            .sort((a, b) => (a.priority - b.priority));
        // Render and serialize each part
        for (const part of parts) {
            await part.render(data);
            const xml = part.serialize();
            // For testing only
            if (part.name === 'word/document.xml' ||
                part.name === 'ppt/slides/slide1.xml' ||
                part.name === 'xl/sharedStrings.xml') {
                ret = xml;
            }
            // Update zip stream
            this._zip.file(part.name, xml);
        }
        return ret; // For testing only
    }

    /**
     * saveAs
     * @param path
     */
    async saveAs(path: string) { // TODO Consider passing JSZip generateAsync options
        if (!this._rendered) throw new YumError(1007);
        if (isNodeJS) {
            const buf = await this._zip.generateAsync({
                type: 'nodebuffer',
                streamFiles: true,
                // compression: 'DEFLATE'
            });
            await fs.writeFile(path, buf);
        } else {
            const blob = await this._zip.generateAsync({type: 'blob' });
            saveAs(blob, path);

        }
    }
}

/**
 * Default export
 */
export default YumTemplate;