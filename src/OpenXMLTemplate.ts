import * as fs from 'fs';
import JSZip from 'jszip';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import constants from './constants';
import OpenXMLContentTypes from './OpenXMLContentTypes';
import DefaultPartRenderer from "./parts/DefaultPartRenderer";
import {sanitizeWordMarkupInExpressions} from "./word/wordUtils";

const CONTENT_TYPES = '[Content_Types].xml';

/**
 * OpenXMLFile
 */
class OpenXMLTemplate {
    private _parts: any[];
    private _zip: JSZip;

    // Instrumentation
    static instrument = false;
    static time = 0;
    static showTime(message: string) {
        if (OpenXMLTemplate.instrument) {
            const t = Date.now();
            console.log(`${message}: ${t - OpenXMLTemplate.time} ms`)
            OpenXMLTemplate.time = t;
        }
    }

    /**
     * constructor
     * @param type
     */
    constructor() {
        this._parts = [];
        this._zip = new JSZip();
    }

    /**
     * load
     * @param path
     */
    async load(path: string) {
        OpenXMLTemplate.time = Date.now();
        // TODO Check browser versus nodeJS (this is nodeJS)
        const handle = await fs.promises.readFile(path);
        this._zip = await JSZip.loadAsync(handle);
        OpenXMLTemplate.showTime('Zip loaded');
        const xml = await this._zip.file(CONTENT_TYPES)?.async('string') || '';
        OpenXMLTemplate.showTime('Content types loaded');
        this._parts = new OpenXMLContentTypes(xml).parts;
        OpenXMLTemplate.showTime('Content types read');
    }

    /**
     * render
     * @param data
     */
    async render(data: any = {}) {
        let ret;
        for (let i = 0; i < this._parts.length; i++) {
            const name = this._parts[i].PartName.slice(1);
            let xml: string = await this._zip.files[name].async('text');
            // No need to process without openChar in part
            if (xml.indexOf(constants.openChar) > -1) {
                if (name.startsWith('word')) {
                    xml = sanitizeWordMarkupInExpressions(xml);
                }
                const dom = new DOMParser().parseFromString(xml, 'text/xml')
                new DefaultPartRenderer(dom).render(data);
                xml = new XMLSerializer().serializeToString(dom);
                // For testing only
                if (name === 'word/document.xml' ||
                    name === 'ppt/slides/slide1.xml' ||
                    name === 'xl/sharedStrings.xml') {
                    ret = xml;
                }
                // Update zip stream
                this._zip.file(name, xml);
            }
        }
        OpenXMLTemplate.showTime('Data merged');
        return ret; // For testing
    }

    /**
     * saveAs
     * @param path
     */
    async saveAs(path: string) {
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