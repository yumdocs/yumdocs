import constants from "../constants";
import AbstractPart from "./AbstractPart";
import IPart from "./IPart";
import ITag from "../tags/ITag";
import tagMap from "../tags/tagMap";
import {sanitizeWordMarkupInExpressions} from '../word/wordUtils';

/**
 * TemplatedPart
 */
class TemplatedPart extends AbstractPart {
    readonly priority: number = 1;
    private _expressions: Array<ITag> = [];

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
        this.findExpressions();
    }

    /**
     * Search recursively
     * @param node
     * @param ret
     * @private
     */
    private _findExpressions(node: Node) {
        // Find text nodes including HBS markup
        // @see https://www.w3schools.com/xml/prop_element_nodetype.asp
        if ((node.nodeType === 3) && (constants.matchExpression.test(node.nodeValue || ''))) {
            const tag = ''; // TODO there may be several tags in nodeValue
            const Expression = tagMap.get('');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const expression = new Expression(node);
            this._expressions.push(expression);
        }
        // Traverse child nodes recursively
        if (node.hasChildNodes()) {
            const { childNodes } = node;
            for (let i = 0, { length } = childNodes; i < length; i++) {
                this._findExpressions(childNodes.item(i));
            }
        }
    }

    /**
     * Start search
     * @returns {*[]}
     */
    findExpressions() {
        this._findExpressions(this._dom);
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
        for (let i = 0; i < this._expressions.length; i++) {
            await this._expressions[i].render(data);
        }
        // return this._dom; // for testing purpose only
    }
}

/**
 * Default export
 */
export default TemplatedPart;