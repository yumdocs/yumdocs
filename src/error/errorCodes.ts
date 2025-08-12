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

    // File system polyfill errors
    [1040, { code: 1040, message: 'File system operations not available in browser environment'}],
    [1041, { code: 1041, message: 'Directory creation not supported in browser environment'}],
    [1042, { code: 1042, message: 'File reading not supported in browser environment'}],
    [1043, { code: 1043, message: 'File writing not supported in browser environment'}],

    // Parsing Errors
    [2000, { code: 2000, message: 'Template parsing error: Unrecognized tag or malformed template structure'}],
    [2001, { code: 2001, message: 'Template parsing error: Mismatched opening and closing tags'}],
    [2002, { code: 2002, message: 'Template parsing error: Unexpected tag sequence or invalid nesting'}],

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