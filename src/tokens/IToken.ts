import TokenizedNode from "./TokenizedNode";

/**
 * IToken
 */
interface IToken {
    nodes: Map<string, TokenizedNode>;
    addNode(node: TokenizedNode): void
    render(data: Record<string, unknown>): void;
    done: boolean;
}

/**
 * Default export
 */
export default IToken;