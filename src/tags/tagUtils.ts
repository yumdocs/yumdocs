import constants from "../constants";

/**
 * escapeRegExp
 * polyfill for RegExp.escape
 * @see https://github.com/tc39/proposal-regex-escaping/blob/main/polyfill.js
 * @param s
 */
export function escapeRegExp(s: string){
    return s.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * hasTagsRegExp
 * Note: In word, use after running sanitizeWordMarkup
 * @param delimiters
 */
export function hasTagsRegExp(delimiters: { start: string, end: string } = constants.delimiters): RegExp {
    // return /{{[^}]+}}/,
    return new RegExp(`${escapeRegExp(delimiters.start)}[^${escapeRegExp(delimiters.end.slice(0, 1))}]+${escapeRegExp(delimiters.end)}`)
}
