/**
 * IExpression
 */
interface IExpression {
    done: boolean;
    hasEndNode(): boolean;
    render(data: any): void
}

/**
 * Default export
 */
export default IExpression;