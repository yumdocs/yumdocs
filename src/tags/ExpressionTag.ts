import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import MatchedNode from "./MatchedNode";
import expressionEngine from "./expressionEngine";
import constants from "../constants";
import {assert} from "../error/assert";
import YumError from "../error/YumError";
import OptionsType from "../OptionsType";

/**
 * ExpressionTag
 */
class ExpressionTag extends AbstractTag implements ITag {
    static readonly statement = constants.empty;
    static readonly blocks: Array<string> = [];

    /**
     * constructor
     * @param matchedNode
     * @param parent
     */
    constructor(matchedNode: MatchedNode, parent: Array<AbstractTag>, options: OptionsType) {
        super(matchedNode, parent, options);
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown>) {
        const matchedNode = this.matchedNodes.get(ExpressionTag.statement);
        assert(matchedNode instanceof MatchedNode);
        let str: string;
        try {
            // TODO what if condition is not a string???
            str = <string>await expressionEngine.evaluate(matchedNode.expression, data);
        } catch(error) {
            throw new YumError( 1060,{error, data: { expression: matchedNode.expression, data }});
        }
        matchedNode.replaceMatch(str);
        this._done = true;
    }
}

/**
 * Default export
 */
export default ExpressionTag;