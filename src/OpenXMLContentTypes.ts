import { DOMParser } from '@xmldom/xmldom';

const EXCLUDE: Array<string> = [
    // '/word/document.xml',
    '/word/numbering.xml',
    '/word/styles.xml',
    '/word/settings.xml',
    '/word/webSettings.xml',
    '/word/fontTable.xml',
    '/word/theme/theme1.xml',
    '/word/theme/theme2.xml',
    '/word/theme/theme3.xml',
    '/docProps/core.xml',
    '/docProps/app.xml'
    ////////////////////////
    /*
    /ppt/presentation.xml,
    /ppt/slideMasters/slideMaster1.xml,
    /ppt/slides/slide1.xml,
    /ppt/presProps.xml,
    /ppt/viewProps.xml,
    /ppt/theme/theme1.xml,
    /ppt/tableStyles.xml,
    /ppt/slideLayouts/slideLayout1.xml,
    /ppt/slideLayouts/slideLayout2.xml,
    /ppt/slideLayouts/slideLayout3.xml,
    /ppt/slideLayouts/slideLayout4.xml,
    /ppt/slideLayouts/slideLayout5.xml,
    /ppt/slideLayouts/slideLayout6.xml,
    /ppt/slideLayouts/slideLayout7.xml,
    /ppt/slideLayouts/slideLayout8.xml,
    /ppt/slideLayouts/slideLayout9.xml,
    /ppt/slideLayouts/slideLayout10.xml,
    /ppt/slideLayouts/slideLayout11.xml,
    /ppt/changesInfos/changesInfo1.xml,
    /ppt/revisionInfo.xml*/
    //////////////////////////////////
    /*
    // /xl/workbook.xml,
    // /xl/worksheets/sheet1.xml,
    // /xl/theme/theme1.xml,
    // /xl/styles.xml,
    // /xl/sharedStrings.xml
     */
];

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
                // Some parts may be discarded
                if (!EXCLUDE.includes(part.PartName)) {
                    ret.push(part);
                }
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