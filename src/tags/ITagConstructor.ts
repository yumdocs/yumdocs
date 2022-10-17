import TaggedNode from "./TaggedNode";
import AbstractTag from "./AbstractTag";

/**
 * ITagConstructor
 */
interface ITagConstructor {
    statements: Array<string>;
    new(node: TaggedNode): AbstractTag
}

/**
 * Default export
 */
export default ITagConstructor