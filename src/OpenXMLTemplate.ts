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
    private _zip: JSZip; // TODO

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
        // TODO Check browser versus nodeJS (this is nodeJS)
        const handle = await fs.promises.readFile(path);
        this._zip = await JSZip.loadAsync(handle);
        const xml = await this._zip.files[CONTENT_TYPES]?.async('text');
        this._parts = new OpenXMLContentTypes(xml).parts;
    }

    /**
     * render
     * @param data
     */
    async render(data: any = {}) {
        let ret;
        // TODO Add preprocessing (tables) and postprocessing (Excel numbers, TOC Update, else?)
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
    }
}

export default OpenXMLTemplate;