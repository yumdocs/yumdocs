import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import TaggedNode from "./TaggedNode";

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
     * render
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