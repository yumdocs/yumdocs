import AbstractTag from "./AbstractTag";

/**
 * ITagParser
 */
interface ITagParser {
    lexer: RegExp | undefined,
    parse(): Array<AbstractTag>
}

/**
 * Default export
 */
export default ITagParser;