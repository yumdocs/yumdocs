import TaggedNode from "./TaggedNode";

/**
 * ITag
 */
interface ITag {
    nodes: Map<string, TaggedNode>;
    addNode(node: TaggedNode): void
    render(data: Record<string, unknown>): void;
    done: boolean;
}

/**
 * Default export
 */
export default ITag;