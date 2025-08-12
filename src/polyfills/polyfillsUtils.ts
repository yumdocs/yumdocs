/**
 * Extended process interface for Electron compatibility
 */
interface ElectronProcess extends NodeJS.Process {
    type?: string;
}

/**
 * isNodeJS
 * @see https://github.com/mozilla/pdf.js/blob/master/src/shared/is_node.js
 */
export const isNodeJS: boolean =
    typeof process === 'object' &&
    process + '' === '[object process]' &&
    !process.versions.nw &&
    // Check for electron process.type property (exists in Electron but not Node.js)
    !((process as ElectronProcess).versions.electron && (process as ElectronProcess).type && (process as ElectronProcess).type !== 'browser');

/**
 * global/window
 */
export const g = new Function('return this')();
