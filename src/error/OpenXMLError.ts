import errorCodes from './errorCodes';

/**
 * OpenXMLError
 */
class OpenXMLError extends Error {
    code: number;
    // TODO data
    name: string;
    originalError: Error | undefined;
    // TODO stack

    /**
     * constructor
     * @param code
     * @param originalError
     */
    constructor(code: number, originalError?: Error) {
        const error = errorCodes.get(code) || { code, message: '' };
        if (!error.message) {
            error.message = `Missing error code ${code}`;
        }
        super(error.message); // 'Error' breaks prototype chain here
        // @see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.code = code;
        this.originalError = originalError;
        this.name = 'OpenXMLError';
    }
}

/**
 * Default export
 */
export default OpenXMLError;