import constants from "../constants";

/**
 * TaggedNode
 */
class TaggedNode {
    // TODO consider making node and match private
    public node: Text;
    public match: Array<string>;

    /**
     * constructor
     * @param node
     * @param match
     */
    constructor(node: Text, match: Array<string>) {
        this.node = node;
        this.match = match;
    }

    /**
     * statement
     */
    get statement() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.match.groups.statement;
    }

    /**
     * expression
     */
    get expression() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.match.groups.expression;
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
    replaceTag(data: string) {
        const tag: string = this.match[0];
        const offset: number = (this.node.nodeValue || constants.empty).indexOf(tag);
        const count = tag.length;
        return this.node.replaceData(offset, count, data);
    }
}

/**
 * Default export
 */
export default TaggedNode;