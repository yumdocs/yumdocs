import IExpression from './IExpression';

/**
 * AbstractExpression
 */
abstract class AbstractExpression implements IExpression {
    protected _startNode: Text;
    protected _endNode?: Text;
    protected _done = false;

    /**
     * constructor
     * @param startNode
     */
    constructor(startNode: Text, endNode?: Text) {
        this._startNode = startNode;
        if (endNode) {
            this._endNode = endNode;
        }
    }

    /**
     * done
     */
    get done(): boolean {
        return this._done;
    }

    /**
     * hasEndNode
     */
    hasEndNode() {
        return !!this._endNode;
    }

    /**
     * render
     * @param data
     */
    abstract render(data: any): void
}

/**
 * Default export
 */
export default AbstractExpression;