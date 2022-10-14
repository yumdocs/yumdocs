import AbstractToken from "./AbstractToken";
import handlebars from "handlebars";

/**
 * ExpressionToken
 */
class ExpressionToken extends AbstractToken {
    static readonly tag = '';

    /**
     * constructor
     * @param startNode
     */
    constructor(startNode: Text) {
        super(startNode);
    }

    /**
     * Render
     * @param data
     */
    render(data: any) {
        // Merge with data
        const template = handlebars.compile(this._startNode.nodeValue);
        this._startNode.replaceData(0, (this._startNode.nodeValue || '').length, template(data));
        this._done = true;
    }
}

/**
 * Default export
 */
export default ExpressionToken;