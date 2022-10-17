import * as fs from 'fs';
import JSZip from 'jszip';
import { DOMParser } from '@xmldom/xmldom';
import enGB from './cultures/en-GB';
import enUS from './cultures/en-US';
import frFR from './cultures/fr-FR';
import IPart from "./parts/IPart";
import AbstractTag from './tags/AbstractTag';
import ExpressionTag from "./tags/ExpressionTag";
import AbstractPart from "./parts/AbstractPart";
import TemplatedPart from "./parts/TemplatedPart";
import OpenXMLError from "./error/OpenXMLError";
import constants from "./constants";
import TaggedNode from "./tags/TaggedNode";
import EachTag from "./tags/EachTag";
import IfToken from "./tags/IfTag";
//import OpenXMLError from "./error/OpenXMLError";

const CONTENT_TYPES = '[Content_Types].xml';

/**
 * IPartConstructor
 */
interface IPartConstructor {
    new(name: string, type: string, xml: string, parent: Map<string, IPart>): AbstractPart
}

/**
 * IPartReference
 */
interface IPartReference {
    name: string,
    type: string,
    Part: IPartConstructor // typeof AbstractPart
}

/**
 * ITagConstructor
 */
interface ITagConstructor {
    statements: Array<string>;
    new(node: TaggedNode): AbstractTag
}

/**
 * OpenXMLTemplate
 */
class OpenXMLTemplate {
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
    static cultures: Map<string, Record<string, unknown>> = new Map([
        ['en-GB', enGB],
        ['en-US', enUS],
        ['fr-FR', frFR]
    ]);
    static registerCulture(locale: string, culture: Record<string, unknown>) {
        // Note: a registered culture can be replaced
        OpenXMLTemplate.cultures.set(locale, culture);
    }

    // ----------------------------------
    // Parts
    // ----------------------------------
    // static parts: Map<string, typeof AbstractPart> = new Map([
    static parts: Map<string, IPartConstructor > = new Map([
        // Word
        ['word/document.xml', TemplatedPart],
        // Powerpoint
        ['ppt/slides/slide.xml', TemplatedPart],
        // Excel
        ['xl/sharedStrings.xml', TemplatedPart]
    ]);
    // static registerPart(name: string, Part: typeof AbstractPart) {
    static registerPart(name: string, Part: IPartConstructor) {
        // Note: a registered expression can be replaced
        OpenXMLTemplate.parts.set(name, Part);
    }

    // ----------------------------------
    // Tags
    // ----------------------------------
    // static tags: Map<string, typeof AbstractTag> = new Map([
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    static tags: Map<string, ITagConstructor> = new Map([
        [ExpressionTag.tag, ExpressionTag],
        [EachTag.tag, EachTag],
        [IfToken.tag, IfToken]
    ]);
    // static registerTag(name: string, Tag: typeof AbstractTag) {
    static registerTag(name: string, Tag: ITagConstructor) {
        // Note: a registered expression can be replaced
        OpenXMLTemplate.tags.set(name, Tag);
    }

    /**
     * constructor
     * @param options
     */
    constructor(options: Record<string, unknown> = {}) {
        // TODO add options including culture
        // this._delimiters: [string, string] = options.delimiters || constants.delimiters
        this._parts = new Map();
        this._zip = new JSZip();
    }

    /**
     * load
     * @param path
     */
    async load(path: string) {
        OpenXMLTemplate.resetTime();
        // TODO Check browser versus nodeJS (this is nodeJS)
        try {
            const handle = await fs.promises.readFile(path);
            this._zip = await JSZip.loadAsync(handle);
        } catch (error) {
            if (Object.prototype.hasOwnProperty.call(error, 'syscall')) {
                throw new OpenXMLError(1001, {data: {path}, error});
            } else if ((<Error>error).message.startsWith('Can\'t find end of central directory')) {
                throw new OpenXMLError(1002, {data: {path}, error});
            } else {
                throw new OpenXMLError(1003, {data: {path}, error});
            }
        }
        OpenXMLTemplate.showTime('Zip loaded');
    }

    /**
     * _getPartRefs
     * @private
     */
    async _getPartRefs() : Promise<Array<IPartReference>> {
        const ret: Array<IPartReference> = [];
        let xml;
        try {
            OpenXMLTemplate.resetTime();
            xml = await this._zip.file(CONTENT_TYPES)?.async('string') || '';
            OpenXMLTemplate.showTime('Content types loaded as xml');
            const dom = new DOMParser().parseFromString(xml, 'text/xml');
            const nodes = dom.childNodes[2].childNodes;
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
                        const Part = OpenXMLTemplate.parts.get(name.replace(/\d+(.xml)$/, '$1'));
                        // Note: without registered part in OpenXMLTemplate.parts, no rendering
                        if (Part) {
                            ret.push({name, type, Part});
                        }
                    }
                }
            }
        } catch (error) {
            throw new OpenXMLError(1004, { data: {xml}, error });
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
            this._parts.set(ref.name, new ref.Part(ref.name, ref.type, xml, this._parts));
        });
        await Promise.all(promises);
        OpenXMLTemplate.showTime('Content parts loaded');
    }

    /**
     * render
     * @param data
     */
    async render(data: any = {}): Promise<string | undefined> {
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
            part.render(data);
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
    async saveAs(path: string) {
        OpenXMLTemplate.resetTime();
        // TODO Check browser versus nodeJS (this is nodeJS)
        const buf = await this._zip.generateAsync({
            type: 'nodebuffer',
            streamFiles: true,
            // compression: 'DEFLATE'
        });
        await fs.promises.writeFile(path, buf);
        OpenXMLTemplate.showTime('Zip saved');
    }
}

export default OpenXMLTemplate;