import OpenXMLError from './OpenXMLError';

/**
 * assert
 * @param condition
 * @param message
 */
export function assert(condition: any, message?: string): asserts condition {
    if (!condition) {
        throw new OpenXMLError(1001, message ? { data: { message } } : undefined);
    }
}