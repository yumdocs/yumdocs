import {g, isNodeJS} from './polyfillsUtils';
import FileSaver from 'file-saver';

class FileProxy {}
class BlobProxy {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function saveAsProxy(blob: Blob, path: string) { return; } // TODO or throw?

export const File = isNodeJS ? FileProxy : g.File;
export const Blob = isNodeJS ? BlobProxy : g.Blob;
export const saveAs = isNodeJS ? saveAsProxy : FileSaver.saveAs;