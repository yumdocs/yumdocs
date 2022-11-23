import MatchedNode from "./MatchedNode";
import AbstractTag from "./AbstractTag";
import OptionsType from "../OptionsType";

/**
 * ITagConstructor
 */
interface ITagConstructor {
    statement: string;
    blocks: Array<string>;
    new(node: MatchedNode, parent: Array<AbstractTag>, options: OptionsType): AbstractTag;
}

/**
 * Default export
 */
export default ITagConstructor