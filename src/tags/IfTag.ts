import AbstractTag from "./AbstractTag";
import TaggedNode from "./TaggedNode";

class IfToken extends AbstractTag {
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
     * Render
     * @param data
     */
    async render(data: Record<string, unknown> = {}) {
        this._done = true;
    }
}

/**
 * Default export
 */
export default IfToken;