import YumError from "../error/YumError";

/**
 * File system operations are not available in browser environment
 * These functions throw specific errors to help developers understand the limitation
 */

const mkdirError = () => { 
    throw new YumError(1041, {
        data: {
            environment: 'browser',
            suggestion: 'Use YumTemplate with file inputs/outputs or consider Node.js environment for file operations'
        }
    });
};

const readFileError = () => { 
    throw new YumError(1042, {
        data: {
            environment: 'browser',
            suggestion: 'Use FileReader API or YumTemplate.loadFile() with File/Blob objects'
        }
    });
};

const writeFileError = () => { 
    throw new YumError(1043, {
        data: {
            environment: 'browser',
            suggestion: 'Use YumTemplate.saveAs() or FileSaver.js for downloading files'
        }
    });
};

export const promises = {
    mkdir: mkdirError,
    readFile: readFileError,
    writeFile: writeFileError
};
