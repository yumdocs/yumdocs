import { g, isNodeJS } from './polyfillsUtils';
import FileSaver from 'file-saver';

class FileProxy {}
class BlobProxy {}

/**
 * Node.js implementation of saveAs fallback
 * In Node.js environment, we provide a meaningful error rather than silently failing
 */
function saveAsProxy(blob: Blob, path: string): never {
    throw new Error(
        `saveAs is not available in Node.js environment. ` +
            `To save files in Node.js, use YumTemplate.saveFile() method instead, ` +
            `or implement your own file writing logic with the rendered buffer.`,
    );
}

export const File = isNodeJS ? FileProxy : g.File;
export const Blob = isNodeJS ? BlobProxy : g.Blob;
export const saveAs = isNodeJS ? saveAsProxy : FileSaver.saveAs;
