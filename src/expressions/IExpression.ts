/**
 * IExpression
 */
interface IExpression {
    startNode: any;
    endNode?: any;
    render(data: any): void
}

/**
 * Default export
 */
export default IExpression;