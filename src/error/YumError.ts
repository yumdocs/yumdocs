import errorCodes from './errorCodes';

/**
 * YumError
 */
class YumError extends Error {
    readonly name: string = 'YumError';
    code: number;
    data?: Record<string, unknown>;
    originalError?: Error;
    
    /**
     * Enhanced stack trace that includes original error stack when available
     */
    get stackTrace(): string {
        let result = this.stack || 'No stack trace available';
        
        if (this.originalError?.stack) {
            result += '\n\nCaused by: ' + this.originalError.stack;
        }
        
        return result;
    }

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
            this.data = <Record<string, unknown>>options.data;
        }
        this.name = 'YumError';
        
        // Ensure stack trace is properly captured
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, YumError);
        }
    }
}

/**
 * Default export
 */
export default YumError;