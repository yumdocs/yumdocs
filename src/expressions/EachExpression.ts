import AbstractExpression from "./AbstractExpression";

class EachExpression extends AbstractExpression {
    static readonly tag = 'each';

    /**
     * constructor
     * @param startNode
     * @param endNode
     */
    constructor(startNode: Text, endNode: Text) {
        super(startNode, endNode);
    }

    /**
     * @param data
     */
    render(data: any) {
        this._done = true;
    }
}

/**
 * Default export
 */
export default EachExpression;