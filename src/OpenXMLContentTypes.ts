import { DOMParser } from '@xmldom/xmldom';

/**
 * OpenXMLContentTypes
 */
class OpenXMLContentTypes {
    private _dom: Document;
    private _parts: any[];

    /**
     * constructor
     * @param xml
     */
    constructor(xml: string) {
        this._dom = new DOMParser().parseFromString(xml, 'text/xml');
        this._parts = this._getParts(this._dom);
    }

    /**
     * _getParts
     * @param dom
     * @private
     */
    private _getParts(dom: Document) {
        const ret = [];
        const nodes = dom.childNodes[2].childNodes;
        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i] as Element;
            // We ignore nodes with nodeName === 'Default' nodes'
            if (node.nodeName === 'Override') {
                const { attributes } = node;
                const part : {[index: string]:any} = {};
                for(let j = 0; j < attributes.length; j++) {
                    const { nodeName, nodeValue } = attributes[j];
                    part[nodeName] = nodeValue
                }
                // TODO: Some parts might probably be ignored
                ret.push(part);
            }
        }
        return ret;
    }

    /**
     * get parts
     */
    get parts() {
        return this._parts;
    }
}

export default OpenXMLContentTypes;