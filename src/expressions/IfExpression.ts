import AbstractExpression from "./AbstractExpression";

class IfExpression extends AbstractExpression {
    static readonly tag = 'if';

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
export default IfExpression;