import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import MatchedNode from "./MatchedNode";
import OptionsType from "../OptionsType";
import {assert} from "../error/assert";
import expressionEngine from "./expressionEngine";
import YumError from "../error/YumError";
import {DOMParser} from '../polyfills/xmldom';
import constants from "../constants";

// TODO Use https://www.npmjs.com/package/node-html-parser

function getParagraphBuilder(attr?: Record<string, unknown>) {
    return function buildParagraph(current: Node, xml: Document) { // TODO Options
        let c = current;
        let ret = xml.createElement('w:p');
        c.appendChild(ret);
        c = ret;
        ret = xml.createElement('w:r');
        c.appendChild(ret);
        c = ret;
        ret = xml.createElement('w:t');
        c.appendChild(ret);
        return ret;
    };
}

function getBuilder(tagName: string, attr?: Record<string, unknown>) {
    switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return getParagraphBuilder(attr);
        case 'p':
        case 'div':
            return getParagraphBuilder(attr);
        // case 'strong':
        // case 'em':
        // case 'ol':
        // case 'ul':
        // case 'li':
        // case 'table':
        // case 'tr':
        // case 'td':
        default:
            return;
    }
}

/**
 * HtmlTag
 */
class HtmlTag extends AbstractTag implements ITag {
    static readonly statement = '#html';
    static readonly blocks: Array<string> = [];

    /**
     * constructor
     * @param matchedNode
     * @param parent
     * @param options
     */
    constructor(matchedNode: MatchedNode, parent: Array<AbstractTag>, options: OptionsType) {
        super(matchedNode, parent, options);
    }

    /**
     * _convert
     * @param node the source node
     * @param current the parent of the target node
     * @param xml the target dom
     */
    _convert(node: Node, current: Node, xml: Document) {
        if (node.nodeType === 3) { // if (node instanceof Text) {
            const text = node.cloneNode(true);
            current.appendChild(text);
        } else {
            const {tagName} = node as Element;
            const builder = getBuilder(tagName /*, attr*/);
            if (builder) {
                current = builder(current, xml);
            }
        }
        if (node.hasChildNodes()) {
            const {childNodes} = node;
            for (let i = 0, {length} = childNodes; i < length; i++) {
                this._convert(childNodes[i], current, xml);
            }
        }
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown> = {}) {
        const matchedNode = this.matchedNodes.get(HtmlTag.statement);
        assert(matchedNode instanceof MatchedNode);
        let html: string;
        try {
            html = <string>await expressionEngine.evaluate(matchedNode.expression, data);
        } catch(error) {
            throw new YumError( 1060,{error, data: { expression: matchedNode.expression, data }});
        }
        const dom = new DOMParser().parseFromString(`<${constants.fragment}>${html}</${constants.fragment}>`, constants.htmlMimeType);
        const xml = new DOMParser().parseFromString(`<${constants.fragment}></${constants.fragment}>`, constants.xmlMimeType);
        this._convert(dom.childNodes[0], xml.childNodes[0], xml);
        // Consider this for RawTag and inherit
        const parent = matchedNode.node.parentNode
        // parent.replaceChildren()
        this._done = true;
    }
}

/**
 * Default export
 */
export default HtmlTag;