import AbstractToken from "./AbstractToken";
import handlebars from "handlebars";
import TokenizedNode from "./TokenizedNode";
import IToken from "./IToken";

/**
 * ExpressionToken
 */
class ExpressionToken extends AbstractToken implements IToken {
    static readonly tag = '';
    static readonly statements: Array<string> = [''];

    /**
     * constructor
     * @param none
     */
    constructor(node: TokenizedNode) {
        super(node);
    }

    /**
     * Render
     * @param data
     */
    render(data: Record<string, unknown> = {}) {
        // Merge with data
        const node = this.nodes.get(ExpressionToken.statements[0])?.node;
        if (node) {
            const template = handlebars.compile(node.nodeValue);
            node.replaceData(0, (node.nodeValue || '').length, template(data));
        }
        this._done = true;
    }
}

/**
 * Default export
 */
export default ExpressionToken;