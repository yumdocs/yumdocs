import {isNodeJS} from './polyfillsUtils';
import YumError from "../error/YumError";

const error = () => { throw new YumError(1020); } // TODO Review code
const req = isNodeJS ? require : () => {
    return {
        promises : {
            mkdir: error,
            readFile: error,
            writeFile: error
        }
    };
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const { promises } = req('fs');
