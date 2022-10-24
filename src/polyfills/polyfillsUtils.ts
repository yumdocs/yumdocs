/**
 * isNodeJS
 * @see https://github.com/mozilla/pdf.js/blob/master/src/shared/is_node.js
 */
export const isNodeJS: boolean =
    typeof process === 'object' &&
    process + '' === '[object process]' &&
    !process.versions.nw &&
    // @ts-expect-error TS2339: Property 'type' does not exist on type 'Process'.
    !(process.versions.electron && process.type && process.type !== 'browser');

/**
 * global/window
 */
export const g = new Function('return this')();

/**
 * Avoid complaints
 */
//
// if (typeof g.require === 'undefined') {
//     g.require = function(obj) { return obj; };
// }