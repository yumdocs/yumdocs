import MatchedNode from "./MatchedNode";
import AbstractTag from "./AbstractTag";

/**
 * ITagConstructor
 */
interface ITagConstructor {
    statement: string;
    blocks: Array<string>;
    new(node: MatchedNode, parent: Array<AbstractTag>): AbstractTag;
}

/**
 * Default export
 */
export default ITagConstructor