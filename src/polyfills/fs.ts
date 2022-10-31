import {isNodeJS} from './polyfillsUtils';
import YumError from "../error/YumError";

const error = () => { throw new YumError(1020); } // TODO Review code

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const promises = isNodeJS ? require('fs').promises : {
    mkdir: error,
    readFile: error,
    writeFile: error
};
