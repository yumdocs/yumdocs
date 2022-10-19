import OpenXMLError from './OpenXMLError';

export function assert(condition: any, message?: string): asserts condition {
    if (!condition) {
        throw new OpenXMLError(1001, { data: { message } });
    }
}