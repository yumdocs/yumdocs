/**
 * IExpressionEngine
 */
interface IExpressionEngine {
    evaluate(expression: string, context: Record<string, unknown>): Promise<unknown>
}

/**
 * Default export
 */
export default IExpressionEngine;
