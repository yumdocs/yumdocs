import jexl from "jexl";
import IExpressionEngine from "./IExpressionEngine";

/**
 * ExpressionEngine
 */
class ExpressionEngine implements IExpressionEngine {
    private _evaluate: (expression: string, context: Record<string, unknown>) => Promise<unknown>;

    /**
     * constructor
     * @param evaluate
     */
    constructor(evaluate: (expression: string, context: Record<string, unknown>) => Promise<unknown>) {
        this._evaluate = evaluate;
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

// Functions
// Note: interestingly, there is no collision between function names and json property names,
// so the $ prefix could be discarded
jexl.addFunction('$min', Math.min);
jexl.addFunction('$max', Math.max);

// String transforms
jexl.addTransform('upper', (val) => String(val).toUpperCase());
jexl.addTransform('lower', (val) => String(val).toLowerCase());
jexl.addTransform('substr', (val, start, end) => String(val).substring(start, end));

// Boolean

// Number

// Date

// Array

const expressionEngine = new ExpressionEngine(jexl.eval.bind(jexl));

/**
 * Default export
 */
export default expressionEngine;