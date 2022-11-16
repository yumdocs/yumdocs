import JSZip from "jszip";
import IPartReference from "./parts/IPartReference";
import {DOMParser} from "./polyfills/xmldom";
import constants from "./constants";
import {isNodeJS} from "./polyfills/polyfillsUtils";
import partMap from "./parts/partMap";
import YumError from "./error/YumError";
import IPart from "./parts/IPart";
import OptionsType from "./OptionsType";

const CONTENT_TYPES = '[Content_Types].xml';

/**
 * OpenXMLContentTypes
 */
class OpenXMLContentTypes {
    private _zip: JSZip;
    private _options: OptionsType;

    /**
     * Constructor
     * @param zip
     */
    constructor(zip: JSZip, options: OptionsType) {
        this._zip = zip;
        this._options = options;
    }

    /**
     * _getPartRefs
     * @private
     */
    private async _getPartRefs() : Promise<Array<IPartReference>> {
        const ret: Array<IPartReference> = [];
        let xml;
        try {
            xml = await this._zip.file(CONTENT_TYPES)?.async('string') || '';
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
                        // Note: without registered part in YumTemplate.parts, no rendering
                        if (Part) {
                            ret.push({name, type, Part});
                        }
                    }
                }
            }
        } catch (error) {
            throw new YumError(1022, { data: {xml}, error });
        }
        return ret;
    }

    /**
     * loadParts
     * @param parts
     */
    public async loadParts(parts: Map<string, IPart>) : Promise<void> {
        // List partRefs from [Content_Types].xml
        const partRefs = await this._getPartRefs();
        // Note: Priority order is not important here
        const promises = partRefs.map(async (ref: IPartReference) => {
            const xml: string = await this._zip.files[ref.name].async('text');
            parts.set(
                ref.name,
                new ref.Part(ref.name, ref.type, xml, parts, this._options)
            );
        });
        await Promise.all(promises);
    }

}

/**
 * Default export
 */
export default OpenXMLContentTypes;