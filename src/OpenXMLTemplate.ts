import * as fs from './polyfills/fs';
import JSZip from 'jszip';
import { DOMParser } from './polyfills/xmldom';
import constants from './constants';
import cultureMap from './cultures/cultureMap';
import OpenXMLError from "./error/OpenXMLError";
import IPart from "./parts/IPart";
import IPartConstructor from "./parts/IPartConstructor";
import IPartReference from "./parts/IPartReference";
import partMap from "./parts/partMap";
import ITagConstructor from "./tags/ITagConstructor";
import tagMap from "./tags/tagMap";
import expressionEngine from "./tags/expressionEngine";
import { File, saveAs } from "./polyfills/File";
import {isNodeJS} from "./polyfills/polyfillsUtils";

const CONTENT_TYPES = '[Content_Types].xml';

/**
 * OpenXMLTemplate
 */
class OpenXMLTemplate {
    private readonly _options: Record<string, unknown>;
    private readonly _parts: Map<string, IPart>;
    private _zip: JSZip;

    // ----------------------------------
    // Instrumentation (can be removed)
    // ----------------------------------
    static instrument = false;
    static time = 0;
    static resetTime() {
        OpenXMLTemplate.time = Date.now();
    };
    static showTime(message: string) {
        if (OpenXMLTemplate.instrument) {
            const t = Date.now();
            console.log(`${message}: ${t - OpenXMLTemplate.time} ms`)
            OpenXMLTemplate.time = t;
        }
    };

    // ----------------------------------
    // Cultures
    // ----------------------------------
    static registerCulture(locale: string, culture: Record<string, unknown>) {
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
    constructor(options: Record<string, unknown> = {}) {
        this._options = this._sanitizeOptions(options);
        this._parts = new Map();
        this._zip = new JSZip();
    }

    /**
     * _sanitizeOptions
     *  options.delimiters
     *  options.locale
     * @param options
     * @private
     */
    private _sanitizeOptions(options: Record<string, unknown>) {
        // TODO Possibly check invalid options and raise errors
        return {
            delimiters: <{start: string, end: string}>(options.delimiters || constants.delimiters),
            locale: <string>(options.locale || constants.locale)
        };
    }

    /**
     * _loadNodePath
     * @param path
     * @private
     */
    private async _loadNodePath(path: string) {
        try {
            const handle = await fs.promises.readFile(path);
            this._zip = await JSZip.loadAsync(handle);
        } catch (error) {
            if (Object.prototype.hasOwnProperty.call(error, 'syscall')) {
                throw new OpenXMLError(1011, {data: {path}, error});
            } else if ((<Error>error).message.startsWith('Can\'t find end of central directory')) {
                throw new OpenXMLError(1012, {data: {path}, error});
            } else {
                throw new OpenXMLError(1013, {data: {path}, error});
            }
        }
    }

    /**
     * _loadBrowserFile
     * @param file
     * @private
     */
    private async _loadBrowserFile(file: File) {
        try {
            this._zip = await JSZip.loadAsync(file);
        } catch(error) {
            console.log((<Error>error).message);
            debugger;
        }
    }

    /**
     * load
     * @param handle
     */
    async load(handle: string | File) { // TODO Consider Blob, ArrayBuffer and more...
        OpenXMLTemplate.resetTime();
        if (isNodeJS && typeof handle === 'string') {
            await this._loadNodePath(<string>handle);
        } else if (!isNodeJS && handle instanceof File) {
            await this._loadBrowserFile(<File>handle);
        } else {
            throw new OpenXMLError(2000); // TODO review code + message
        }
        OpenXMLTemplate.showTime('Zip loaded');
    }

    /**
     * _getPartRefs
     * @private
     */
    private async _getPartRefs() : Promise<Array<IPartReference>> {
        const ret: Array<IPartReference> = [];
        let xml;
        try {
            OpenXMLTemplate.resetTime();
            xml = await this._zip.file(CONTENT_TYPES)?.async('string') || '';
            OpenXMLTemplate.showTime('Content types loaded as xml');
            const dom = new DOMParser().parseFromString(xml, constants.mimeType);
            const nodes = dom.childNodes[isNodeJS ? 2 : 0].childNodes;
            for(let i = 0; i < nodes.length; i++) {
                const node = nodes[i] as Element;
                // We ignore nodes with nodeName === 'Default' nodes'
                if (node.nodeName === 'Override') {
                    const { attributes } = node;
                    let name, type;
                    for(let j = 0; j < attributes.length; j++) {
                        const { nodeName, nodeValue } = attributes[j];
                        switch (nodeName) {
                            case 'PartName':
                                name = (nodeValue || '').slice(1); // Remove /
                                break;
                            case 'ContentType':
                                type = nodeValue;
                                break;
                            default:
                         }
                    }
                    if (name && type) {
                        const Part = partMap.get(name.replace(/\d+(.xml)$/, '$1'));
                        // Note: without registered part in OpenXMLTemplate.parts, no rendering
                        if (Part) {
                            ret.push({name, type, Part});
                        }
                    }
                }
            }
        } catch (error) {
            throw new OpenXMLError(1014, { data: {xml}, error });
        }
        OpenXMLTemplate.showTime('Content types read');
        return ret;
    }

    /**
     * _loadParts
     * @private
     */
    private async _loadParts(partRefs: Array<IPartReference>) : Promise<void> {
        OpenXMLTemplate.resetTime();
        // Note: Priority order is not important here
        const promises = partRefs.map(async (ref: IPartReference) => {
            const xml: string = await this._zip.files[ref.name].async('text');
            this._parts.set(
                ref.name,
                new ref.Part(ref.name, ref.type, xml, this._parts, this._options)
            );
        });
        await Promise.all(promises);
        OpenXMLTemplate.showTime('Content parts loaded');
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown> = {}): Promise<string | undefined> {
        let ret: string | undefined;
        // List partRefs from [Content_Types].xml
        const partRefs = await this._getPartRefs();
        // Load xml files into Parts including xml dom
        await this._loadParts(partRefs);
        OpenXMLTemplate.resetTime();
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
        OpenXMLTemplate.showTime('Data merged');
        return ret; // For testing
    }

    /**
     * saveAs
     * @param path
     */
    async saveAs(path: string) { // TODO Consider passing JSZip generateAsync options
        OpenXMLTemplate.resetTime();
        if (isNodeJS) {
            const buf = await this._zip.generateAsync({
                type: 'nodebuffer',
                streamFiles: true,
                // compression: 'DEFLATE'
            });
            await fs.promises.writeFile(path, buf);
        } else {
            const blob = await this._zip.generateAsync({type: 'blob' });
            saveAs(blob, path);

        }
        OpenXMLTemplate.showTime('Zip saved');
    }
}

export default OpenXMLTemplate;