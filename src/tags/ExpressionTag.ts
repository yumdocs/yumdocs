import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import MatchedNode from "./MatchedNode";
import expressionEngine from "./expressionEngine";
import constants from "../constants";
import {assert} from "../error/assert";

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
    constructor(matchedNode: MatchedNode, parent: Array<AbstractTag>) {
        super(matchedNode, parent);
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown>) {
        const matchedNode = this.matchedNodes.get(ExpressionTag.statement);
        assert(matchedNode instanceof MatchedNode);
        const str: string = <string>await expressionEngine.evaluate(matchedNode.expression, data);
        matchedNode.replaceMatch(str);
        this._done = true;
    }
}

/**
 * Default export
 */
export default ExpressionTag;