import TaggedNode from "./TaggedNode";
import AbstractTag from "./AbstractTag";

/**
 * ITagConstructor
 */
interface ITagConstructor {
    statement: string;
    blocks: Array<string>;
    new(node: TaggedNode, parent: Array<AbstractTag>): AbstractTag;
}

/**
 * Default export
 */
export default ITagConstructor