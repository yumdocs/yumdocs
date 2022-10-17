import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import TaggedNode from "./TaggedNode";

class EachTag extends AbstractTag implements ITag {
    static readonly tag = '#each';
    static readonly statements: Array<string> = ['#each', '#endeach'];

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
export default EachTag;