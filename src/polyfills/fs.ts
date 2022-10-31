import {isNodeJS} from './polyfillsUtils';
import YumError from "../error/YumError";

const error = () => { throw new YumError(1020); } // TODO Review code

// TODO review this ugly hack to cheat webpack
//  Test in docusaurus, which raises the issue.
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
