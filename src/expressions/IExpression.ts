/**
 * IExpression
 */
interface IExpression {
    readonly hasEndNode: boolean;
    setEndNode(endNode: Text, children?: Array<Text>): void
    render(data: any): void;
    done: boolean;
}

/**
 * Default export
 */
export default IExpression;