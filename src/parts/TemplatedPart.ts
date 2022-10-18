import constants from "../constants";
import AbstractPart from "./AbstractPart";
import IPart from "./IPart";
import ITag from "../tags/ITag";
import tagMap from "../tags/tagMap";
import {sanitizeWordMarkupInExpressions} from '../word/wordUtils';
import TaggedNode from "../tags/TaggedNode";

/**
 * TemplatedPart
 */
class TemplatedPart extends AbstractPart {
    readonly priority: number = 1;
    private _tags: Array<ITag> = [];

    /**
     * constructor
     * @param name
     * @param type
     * @param xml
     * @param parent
     * @param options
     */
    constructor(
        name: string,
        type: string,
        xml: string,
        parent: Map<string, IPart>,
        options: Record<string, unknown>
    ) {
        super(name, type, xml, parent, options);
        // TODO No need to findExpressions without openChar in part
        //  if (xml.indexOf(constants.openChar) > -1) {
        this.findTags();
    }

    /**
     * _findTags
     * @param node
     * @private
     */
    private _findTags(node: Node) {
        // Find text nodes including HBS markup
        // @see https://www.w3schools.com/xml/prop_element_nodetype.asp
        if ((node.nodeType === 3) && (constants.matchExpression.test(node.nodeValue || ''))) {
            const Tag = tagMap.get('');
            if (Tag) {
                const taggedNode = new TaggedNode(<Text>node, []);
                const tag = new Tag(taggedNode);
                this._tags.push(tag);
            }
        }
        // Traverse child nodes recursively
        if (node.hasChildNodes()) {
            const { childNodes } = node;
            for (let i = 0, { length } = childNodes; i < length; i++) {
                this._findTags(childNodes.item(i));
            }
        }
    }

    /**
     * Start search
     * @returns {*[]}
     */
    findTags() {
        this._findTags(this._dom);
    }

    /**
     * _preProcess
     * @param xml
     */
    protected _preProcess(xml: string): string {
        // TODO No need to _preProcess without openChar in part
        //  if (xml.indexOf(constants.openChar) > -1) {
        if (this._name.startsWith('word/')) {
            return sanitizeWordMarkupInExpressions(xml);
        } else {
            // Do nothing by default
            return super._preProcess(xml);
        }
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown>) {
        for (let i = 0; i < this._tags.length; i++) {
            await this._tags[i].render(data);
        }
        // return this._dom; // for testing purpose only
    }
}

/**
 * Default export
 */
export default TemplatedPart;