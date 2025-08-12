import jexl from "jexl";
import {EvaluateType, IExpressionEngine} from "./IExpressionEngine";
import {toString} from "./expressionUtils";
import constants from "../constants";

/**
 * ExpressionEngine
 */
class ExpressionEngine implements IExpressionEngine {
    private _evaluate: EvaluateType;
    private _global: unknown;

    /**
     * constructor
     * @param evaluate
     * @param g
     */
    constructor(evaluate: EvaluateType, g : unknown = {}) {
        this._evaluate = evaluate;
        this._global = g;
    }

    /**
     * setEval
     * @param evaluate
     * @param g
     */
    setEval(evaluate: EvaluateType, g : unknown = {}) {
        this._evaluate = evaluate;
        this._global = g;
    }

    /**
     * setLocale
     * @param locale
     */
    setLocale(locale: string = constants.locale)  {
        if (this._global) Object.assign(this._global, {locale});
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
jexl.addTransform('lower', (val: unknown) => String(val).toLowerCase());
jexl.addTransform('replace', (val: unknown, search: unknown, replacement: unknown) => String(val).replace(String(search), String(replacement)));
jexl.addTransform('substr', (val: unknown, start: unknown, end: unknown) => String(val).substring(
    typeof start === "number"? Math.trunc(start) : 0,
    typeof end === "number" ? Math.trunc(end) : String(val).length - 1)
);
jexl.addTransform('upper', (val: unknown) => String(val).toUpperCase());

// Boolean - N/A

// Number and Date
// Note: jexl doesn't have a locale property, so we use constants.locale as fallback
jexl.addTransform('format', (val: unknown, fmt: unknown, locale: unknown = constants.locale) =>
    toString(typeof val !== 'string' || isNaN(Date.parse(val as string)) ? val : new Date(Date.parse(val as string)), fmt as string | undefined, locale as string | undefined));

// Array
jexl.addTransform('join', (val: unknown, separator: unknown) => Array.isArray(val) ? val.join(typeof separator === 'undefined' ? '' : String(separator)) : val);
jexl.addTransform('orderBy', async (val: unknown, expression: unknown, reverse = false) => {
    if (Array.isArray(val)) {
        // Eval async jexl expressions on all array items
        const _evals = await Promise.all(val.map(el => jexl.eval(String(expression), el)));
        // Build an array that has both items and expression evals
        const _val = val.map((el, idx) => ({_v: el, _e: _evals[idx]}));
        // Sort based on expression evals
        interface SortItem {
            _e: unknown; // Expression evaluation result
            _v: unknown; // Original value
        }
        _val.sort((a: SortItem, b: SortItem) => {
            // Type guard for comparable types
            const isComparable = (value: unknown): value is string | number | Date => {
                return typeof value === 'string' || typeof value === 'number' || value instanceof Date;
            };
            
            if (typeof a._e === typeof b._e && isComparable(a._e) && isComparable(b._e)) {
                if (a._e < b._e) {
                    return reverse ? 1 : -1;
                } else if (a._e > b._e) {
                    return reverse ? -1 : 1;
                }
            }
            return 0;
        });
        // Return an array of values
        return _val.map(el => el._v);
    } else {
        return val;
    }
});

const expressionEngine = new ExpressionEngine(jexl.eval.bind(jexl), jexl);

/**
 * Default export
 */
export default expressionEngine;