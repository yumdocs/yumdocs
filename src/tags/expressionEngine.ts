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
// @ts-expect-error TS2339: Property 'locale' does not exist on type 'BuildableJexl'.
jexl.addTransform('format', (val: unknown, fmt: unknown, locale: unknown = jexl.locale || constants.locale) =>
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
        // _val.sort((a: { _e: unknown; _v: unknown }, b: { _e: unknown; _v: unknown }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _val.sort((a: { _e: any; _v: any }, b: { _e: any; _v: any }) => {
            if (typeof a._e === typeof b._e && a._e < b._e) {
                return reverse ? 1 : -1;
            } else if (typeof a._e === typeof b._e && a._e > b._e) {
                return reverse ? -1 : 1;
            } else {
                return 0;
            }
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