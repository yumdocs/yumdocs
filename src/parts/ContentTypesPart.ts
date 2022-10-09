import { DOMParser, XMLSerializer } from "@xmldom/xmldom";

class ContentTypesPart {
    private _xml: string;

    constructor(xml = '') {
        this._xml = xml;
    }
}