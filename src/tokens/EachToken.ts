import IToken from "./IToken";
import AbstractToken from "./AbstractToken";
import TokenizedNode from "./TokenizedNode";

class EachToken extends AbstractToken implements IToken {
    static readonly tag = '#each';
    static readonly statements: Array<string> = ['#each', '#endeach'];

    /**
     * constructor
     * @param none
     */
    constructor(node: TokenizedNode) {
        super(node);
    }

    /**
     * @param data
     */
    render(data: Record<string, unknown> = {}) {
        this._done = true;
    }
}

/**
 * Default export
 */
export default EachToken;