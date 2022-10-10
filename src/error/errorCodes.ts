/**
 * Error codes
 */
const errorCodes = new Map<number, { code: number, message: string }>([
    [1000, { code: 1000, message: 'Unknown error'}],
    [1001, { code: 1001, message: 'File not found'}],
    [1002, { code: 1002, message: 'Corrupted file'}],
    [1003, { code: 1003, message: 'File load error'}],
    [1004, { code: 1004, message: 'Missing or malformed [Content_types].xml'}],
]);

/**
 * Default export
 */
export default errorCodes;