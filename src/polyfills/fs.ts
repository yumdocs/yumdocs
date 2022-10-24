import {isNodeJS} from './polyfillsUtils';
import OpenXMLError from "../error/OpenXMLError";

const error = () => { throw new OpenXMLError(1020); } // TODO Review code

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const promises = isNodeJS ? require('node:fs').promises : {
    mkdir: error,
    readFile: error,
    writeFile: error
};
