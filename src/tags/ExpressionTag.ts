import AbstractTag from "./AbstractTag";
import TaggedNode from "./TaggedNode";
import ITag from "./ITag";

/**
 * ExpressionTag
 */
class ExpressionTag extends AbstractTag implements ITag {
    static readonly tag = '';
    static readonly statements: Array<string> = [''];

    /**
     * constructor
     * @param node
     */
    constructor(node: TaggedNode) {
        super(node);
    }

    /**
     * Render
     * @param data
     */
    async render(data: Record<string, unknown> = {}) {
        // Merge with data
        const node = this.nodes.get(ExpressionTag.statements[0])?.node;
        if (node) {
            // const template = handlebars.compile(node.nodeValue);
            // node.replaceData(0, (node.nodeValue || '').length, template(data));
        }
        this._done = true;
    }
}

/**
 * Default export
 */
export default ExpressionTag;