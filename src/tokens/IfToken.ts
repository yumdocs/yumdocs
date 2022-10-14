import AbstractToken from "./AbstractToken";

class IfToken extends AbstractToken {
    static readonly tag = 'if';
    static regexp = /{{#if\s+([^}\s]+)}}/;

    /**
     * constructor
     * @param startNode
     * @param endNode
     */
    constructor(startNode: Text, endNode: Text) {
        super(startNode, endNode);
    }

    /**
     * Render
     * @param data
     */
    render(data: any) {
        this._done = true;
    }
}

/**
 * Default export
 */
export default IfToken;