import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import MatchedNode from "./MatchedNode";
import OptionsType from "../OptionsType";

class ImageTag extends AbstractTag implements ITag {
    static readonly statement = '#image';
    static readonly blocks: Array<string> = [];

    /**
     * constructor
     * @param matchedNode
     * @param parent
     * @param options
     */
    constructor(matchedNode: MatchedNode, parent: Array<AbstractTag>, options: OptionsType) {
        super(matchedNode, parent, options);
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown> = {}) {
        // https://nodejs.org/en/knowledge/HTTP/clients/how-to-create-a-HTTP-request/
        const imageMatchedNode = this.matchedNodes.get(ImageTag.statement);
        debugger;
    }
}

/**
 * Default export
 */
export default ImageTag;