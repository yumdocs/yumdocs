import IToken from './IToken';
import TokenizedNode from "./TokenizedNode";

/**
 * AbstractToken
 */
abstract class AbstractToken implements IToken {
    public nodes: Map<string, TokenizedNode> = new Map();
    protected _done = false;

    /**
     * constructor
     * @param node
     * @protected
     */
    protected constructor(node: TokenizedNode) {
        this.addNode(node);
    }

    /**
     * setEndNode
     * @param node
     */
    addNode(node: TokenizedNode) {
        // TODO Check that it does not already exist?
        this.nodes.set(node.statement, node);
    }

    /**
     * render
     * @param data
     */
    abstract render(data: Record<string, unknown>): void

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
export default AbstractToken;