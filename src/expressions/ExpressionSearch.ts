import constants from "../constants";

/**
 * OpenXMLSearch
 * @param node
 */
class ExpressionSearch {

    private _root: Node;
    /**
     * Constructor
     * @param root
     */
    constructor(root: Node) {
        this._root = root;
    }

    /**
     * Search recursively
     * @param node
     * @param ret
     * @private
     */
    _filter(node: Node, ret: Node[]) { // TODO NodeList
        // Find text nodes including HBS markup
        // @see https://www.w3schools.com/xml/prop_element_nodetype.asp
        if ((node.nodeType === 3) && (constants.matchExpression.test(node.nodeValue || ''))) {
            ret.push(node);
        }
        // Traverse child nodes recursively
        if (node.hasChildNodes()) {
            const { childNodes } = node;
            for (let i = 0, { length } = childNodes; i < length; i++) {
                this._filter(childNodes.item(i), ret);
            }
        }
    }

    /**
     * Start search
     * @returns {*[]}
     */
    filter() {
        const ret: Node[] = [];
        this._filter(this._root, ret);
        return ret;
    }
}

export default ExpressionSearch;