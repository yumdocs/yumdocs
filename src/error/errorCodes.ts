/**
 * Error codes
 */
const errorCodes = new Map<number, { code: number, message: string }>([
    // General errors
    [1000, { code: 1000, message: 'Unknown error'}],
    [1001, { code: 1001, message: 'Assertion error'}],

    // File errors
    [1011, { code: 1011, message: 'File not found'}],
    [1012, { code: 1012, message: 'Corrupted file'}],
    [1013, { code: 1013, message: 'File load error'}],

    // OOXML File format errors
    [1020, { code: 1020, message: 'Missing or malformed [Content_types].xml'}],

    // TODO Parsing Errors

    // JEXL Expression error (unless the expression engine is replaced)
    [1060, { code: 1060, message: 'Expression evaluation error'}],
]);

/**
 * Default export
 */
export default errorCodes;