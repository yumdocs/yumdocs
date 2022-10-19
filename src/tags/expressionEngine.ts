import jexl from "jexl";
import IExpressionEngine from "./IExpressionEngine";

// TODO Configure jexl here

/**
 * ExpressionEngine
 */
class ExpressionEngine implements IExpressionEngine {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _evaluate: (expression: string, context: Record<string, unknown>) => Promise<unknown>;

    /**
     * constructor
     * @param evaluate
     */
    constructor(evaluate: (expression: string, context: Record<string, unknown>) => Promise<unknown>) {
        this.setEval(evaluate);
    }

    /**
     * setEval
     * @param evaluate
     */
    setEval(evaluate: (expression: string, context: Record<string, unknown>) => Promise<unknown>) {
        this._evaluate = evaluate;
    }

    /**
     * evaluate
     * @param expression
     * @param context
     */
    async evaluate(expression: string, context: Record<string, unknown>) {
        return await this._evaluate(expression, context);
    }
}

/**
 * Our expression engine
 */
const expressionEngine = new ExpressionEngine(jexl.eval.bind(jexl));

/**
 * Default export
 */
export default expressionEngine;