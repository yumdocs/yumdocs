import ITag from './ITag';
import MatchedNode from './MatchedNode';
import constants from '../constants';
import ITagContext from './ITagContext';

/**
 * AbstractTag
 */
abstract class AbstractTag implements ITag {
    public readonly matchedNodes: Map<string, MatchedNode> = new Map();
    protected _done = false;

    public readonly children: Array<AbstractTag> = [];
    public readonly parent: Array<AbstractTag>;
    protected readonly _context: ITagContext;

    /**
     * constructor
     * @param matchedNode
     * @param parent
     * @param context
     * @protected
     */
    protected constructor(
        matchedNode: MatchedNode,
        parent: Array<AbstractTag>,
        context: ITagContext,
    ) {
        this.addMatchedNode(matchedNode);
        this.parent = parent;
        this._context = context;
    }

    /**
     * addNode
     * @param matchedNode
     */
    addMatchedNode(matchedNode: MatchedNode) {
        // TODO Also check that node.statement is part of Tag.statements
        this.matchedNodes.set(
            matchedNode.statement ||
                constants.empty /* ExpressionTag.statement */,
            matchedNode,
        );
    }

    /**
     * render
     * @param data
     */
    abstract render(data: Record<string, unknown>): Promise<void>;

    /**
     * done
     */
    get done(): boolean {
        return this._done;
    }

    /**
     * Get template options from context
     */
    protected get options() {
        return this._context.options;
    }

    /**
     * Create a new TagParser for parsing nested nodes
     * @param nodes
     */
    protected createTagParser(nodes: Array<Node>) {
        return this._context.createTagParser(nodes, this._context.options);
    }
}

/**
 * Default export
 */
export default AbstractTag;
