/**
 * Error codes
 */
const errorCodes = new Map<number, { code: number, message: string }>([
    [1000, { code: 1000, message: 'Unknown error'}],
    [1001, { code: 1001, message: 'Assertion error'}],
    //
    [1011, { code: 1011, message: 'File not found'}],
    [1012, { code: 1012, message: 'Corrupted file'}],
    [1013, { code: 1013, message: 'File load error'}],
    [1014, { code: 1014, message: 'Missing or malformed [Content_types].xml'}],
]);

/**
 * Default export
 */
export default errorCodes;