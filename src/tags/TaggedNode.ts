/**
 * TaggedNode
 */
class TaggedNode {
    public node: Text;
    private _match: Array<string>;
    constructor(node: Text, match: Array<string>) {
        this.node = node;
        this._match = match;
    }

    get statement() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this._match.groups.statement;
    }

    get expression() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this._match.groups.expression;
    }
}

/**
 * Default export
 */
export default TaggedNode;