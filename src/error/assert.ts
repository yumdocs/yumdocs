import YumError from './YumError';

/**
 * assert
 * @param condition
 * @param message
 */
export function assert(condition: any, message?: string): asserts condition {
    if (!condition) {
        throw new YumError(1001, message ? { data: { message } } : undefined);
    }
}