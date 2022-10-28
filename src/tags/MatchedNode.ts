import constants from "../constants";

/**
 * MatchNode
 */
class MatchedNode {
    public readonly node: Text;
    private readonly _match: Array<string>;

    /**
     * constructor
     * @param node
     * @param match
     */
    constructor(node: Text, match: Array<string>) {
        this.node = node;
        this._match = match;
    }

    /**
     * statement
     */
    get statement(): string {
        // @ts-expect-error TS2339: Property 'groups' does not exist on type 'string[]'.
        return this._match.groups.statement;
    }

    /**
     * expression
     */
    get expression(): string {
        // @ts-expect-error TS2339: Property 'groups' does not exist on type 'string[]'.
        return this._match.groups.expression;
    }

    /**
     * nodeValue
     */
    get nodeValue(): string | null {
        return this.node.nodeValue;
    }

    /**
     * replaceTag
     * @param data
     */
    replaceMatch(data: string) {
        const tag: string = this._match[0];
        const offset: number = (this.node.nodeValue || constants.empty).indexOf(tag);
        const count: number = tag.length;
        return this.node.replaceData(offset, count, data);
    }
}

/**
 * Default export
 */
export default MatchedNode;