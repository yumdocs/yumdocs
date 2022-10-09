import IExpression from './IExpression';

/**
 * AbstractExpression
 */
abstract class AbstractExpression implements IExpression {
    readonly hasEndNode: boolean;
    protected _startNode: Text;
    protected _children?: Array<Text>;
    protected _endNode?: Text;
    protected _done = false;

    /**
     * constructor
     * @param startNode
     * @param hasEndNode
     * @protected
     */
    protected constructor(startNode: Text, hasEndNode= false) {
        this._startNode = startNode;
        this.hasEndNode = hasEndNode;
    }

    /**
     * setEndNode
     * @param endNode
     * @param children
     */
    setEndNode(endNode: Text, children: Array<Text> = []) {
        if (this.hasEndNode) {
            this._endNode = endNode;
            this._children = children;
        } // TODO else throw?
    }

    /**
     * render
     * @param data
     */
    abstract render(data: any): void

    /**
     * done
     */
    get done(): boolean {
        return this._done;
    }
}

/**
 * Default export
 */
export default AbstractExpression;