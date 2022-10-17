import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import TaggedNode from "./TaggedNode";

class IfTag extends AbstractTag implements ITag {
    static readonly tag = '#if';
    static readonly statements: Array<string> = ['#if', '#else', '#endif'];

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
        this._done = true;
    }
}

/**
 * Default export
 */
export default IfTag;