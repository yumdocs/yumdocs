import errorCodes from './errorCodes';

/**
 * OpenXMLError
 */
class OpenXMLError extends Error {
    readonly name: string = 'OpenXMLError';
    code: number;
    data?: any;
    originalError?: Error;
    // TODO stack

    /**
     * constructor
     * @param code
     * @param options
     */
    constructor(code: number, options: Record<string, unknown> = {}) {
        const error = errorCodes.get(code) || { code, message: '' };
        if (!error.message) {
            error.message = `Missing error code ${code}`;
        }
        super(error.message); // 'Error' breaks prototype chain here
        // @see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.code = code;
        if (options.error instanceof Error) {
            this.originalError = options.error;
        }
        if (Object.prototype.toString.call(options.data) === '[object Object]') {
            this.data = options.data;
        }
        this.name = 'OpenXMLError';
    }
}

/**
 * Default export
 */
export default OpenXMLError;