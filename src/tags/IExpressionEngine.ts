/**
 * EvaluateType
 */
export type EvaluateType = (expression: string, context: Record<string, unknown>) => Promise<unknown>

/**
 * IExpressionEngine
 */
export interface IExpressionEngine {
    evaluate: EvaluateType
}
