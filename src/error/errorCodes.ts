/**
 * Error codes
 */
const errorCodes = new Map<number, { code: number, message: string }>([
    // General errors
    [1000, { code: 1000, message: 'Unknown error'}],
    [1001, { code: 1001, message: 'Assertion error'}],

    // Processing error
    [1005, { code: 1005, message: 'Cannot render without template. Load a new template.'}],
    [1006, { code: 1006, message: 'Cannot render data twice. Load a new template.'}],
    [1007, { code: 1007, message: 'Cannot save without loading and rendering first.'}],

    // File errors
    [1010, { code: 1010, message: 'File not found'}],
    [1011, { code: 1011, message: 'Corrupted file'}],
    [1012, { code: 1012, message: 'File load error'}],
    [1013, { code: 1013, message: 'Url load error'}],
    [1014, { code: 1014, message: 'Data load error'}],

    // OOXML File format errors
    [1020, { code: 1020, message: 'Missing or malformed [Content_types].xml'}],

    // TODO Parsing Errors

    // JEXL Expression error (unless the expression engine is replaced)
    [1060, { code: 1060, message: 'Expression evaluation error'}],

    // if tag errors
    // 1100+

    // #each tag errors
    [1110, { code: 1110, message: 'The #each tag expects an array or undefined'}],
]);

/**
 * Default export
 */
export default errorCodes;