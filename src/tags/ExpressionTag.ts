import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import TaggedNode from "./TaggedNode";
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
     * @param node
     * @param parent
     */
    constructor(node: TaggedNode, parent: Array<AbstractTag>) {
        super(node, parent);
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown>) {
        const taggedNode = this.nodes.get(ExpressionTag.statement);
        assert(taggedNode instanceof TaggedNode);
        const str: string = <string>await expressionEngine.evaluate(taggedNode.expression, data);
        taggedNode.replaceTag(str);
        this._done = true;
    }
}

/**
 * Default export
 */
export default ExpressionTag;