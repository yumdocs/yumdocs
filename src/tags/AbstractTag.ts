import ITag from './ITag';
import MatchedNode from "./MatchedNode";
import constants from "../constants";
import ITagParser from "./ITagParser";
import OptionsType from "../OptionsType";

/**
 * TagParser
 */
type TagParser = { new(nodes: Array<Node>, options: OptionsType): ITagParser; };

/**
 * AbstractTag
 */
abstract class AbstractTag implements ITag {
    // Assigned at runtime in TagParser.ts to resolve a circular dependency
    // src/parts/TagParser.ts -> src/tags/tagMap.ts -> src/tags/EachTag.ts -> src/parts/TagParser.ts
    public static TagParser: TagParser;

    public readonly matchedNodes: Map<string, MatchedNode> = new Map();
    protected _done = false;

    public readonly children: Array<AbstractTag> = [];
    public readonly parent: Array<AbstractTag>;
    public readonly _options: OptionsType;

    /**
     * constructor
     * @param matchedNode
     * @param parent
     * @param options
     * @protected
     */
    protected constructor(matchedNode: MatchedNode, parent: Array<AbstractTag>, options: OptionsType) {
        this.addMatchedNode(matchedNode);
        this.parent = parent;
        this._options = options;
    }

    /**
     * addNode
     * @param matchedNode
     */
    addMatchedNode(matchedNode: MatchedNode) {
        // TODO Also check that node.statement is part of Tag.statements
        this.matchedNodes.set(matchedNode.statement || constants.empty /* ExpressionTag.statement */, matchedNode);
    }

    /**
     * render
     * @param data
     */
    abstract render(data: Record<string, unknown>): Promise<void>

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