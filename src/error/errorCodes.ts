/**
 * Error codes
 */
const errorCodes = new Map<number, { code: number, message: string }>([
    // General errors
    [1000, { code: 1000, message: 'Unknown error'}],
    [1001, { code: 1001, message: 'Assertion error'}],

    // Load errors
    [1010, { code: 1010, message: 'File not found'}],
    [1011, { code: 1011, message: 'Corrupted file'}],
    [1012, { code: 1012, message: 'File load error'}],
    [1013, { code: 1013, message: 'Data load error'}],

    // Render errors
    [1020, { code: 1020, message: 'Cannot render without template. Load a template first.'}],
    [1021, { code: 1021, message: 'Cannot render data twice. Load a new template or save rendered file.'}],
    [1022, { code: 1022, message: 'Missing or malformed [Content_types].xml'}],

    // Save error
    [1030, { code: 1030, message: 'Cannot save without template. Load a template first.'}],
    [1031, { code: 1031, message: 'Cannot save without rendering. Render data first.'}],

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