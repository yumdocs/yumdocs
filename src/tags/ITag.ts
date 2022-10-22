import MatchedNode from "./MatchedNode";

/**
 * ITag
 */
interface ITag {
    matchedNodes: Map<string, MatchedNode>;
    addMatchedNode(matchedNode: MatchedNode): void
    render(data: Record<string, unknown>): Promise<void>;
    done: boolean;
}

/**
 * Default export
 */
export default ITag;