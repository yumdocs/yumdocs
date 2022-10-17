import ITag from './ITag';
import TaggedNode from "./TaggedNode";

/**
 * AbstractTag
 */
abstract class AbstractTag implements ITag {
    public nodes: Map<string, TaggedNode> = new Map();
    protected _done = false;

    /**
     * constructor
     * @param node
     * @protected
     */
    protected constructor(node: TaggedNode) {
        this.addNode(node);
    }

    /**
     * setEndNode
     * @param node
     */
    addNode(node: TaggedNode) {
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
export default AbstractTag;