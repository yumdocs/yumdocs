import {escapeRegExp} from "./tagUtils";
import MatchedNode from "./MatchedNode";
import AbstractTag from "./AbstractTag";
import tagMap from "./tagMap";
import ExpressionTag from "./ExpressionTag";
import ITagConstructor from "./ITagConstructor";
import ITagParser from "./ITagParser";
import {assert} from "../error/assert";
import YumError from "../error/YumError";
import OptionsType from "../OptionsType";

/**
 * TagParser
 */
class TagParser implements ITagParser {
    private readonly _nodes: Array<Node>;
    private _options: OptionsType;
    private _lexer: RegExp | undefined;
    private _ast: Array<AbstractTag> = [];
    private _current: Array<AbstractTag>;
    private _stack: Array<AbstractTag> = [];

    /**
     * constructor
     * @param dom
     * @param options
     */
    constructor(nodes: Array<Node>, options: OptionsType) {
        this._nodes = nodes;
        this._options = options;
        this._current = this._ast;
    }

    /**
     * lexer
     * @private
     */
    get lexer(): RegExp | undefined {
        // Note: we could have used a proper lexer like moo
        // but considering we rely on an expression parser like Jexl
        // our simple needs can be handled by a regular expression
        if (!(this._lexer instanceof RegExp)) {
            const statements: string[] = [];
            // Get registered *Tag blocks (TODO unicity?)
            for (const Tag of tagMap.values()) {
                statements
                    .push(
                        escapeRegExp(Tag.statement),
                        ...Tag.blocks.map(block => escapeRegExp(block))
                    );
            }
            // Build the regular expression
            // TODO: we might have to escape certain characters like < and >
            const { end, start } = <{ end: string, start: string }>this._options.delimiters;
            this._lexer = new RegExp(
                escapeRegExp(start) +
                '[ \t]*' +
                (statements.length? `(?<statement>${statements.join('|')})?[ \t]*` : '') +
                `(?<expression>[^${escapeRegExp(end.slice(0,1))}]+)?` +
                '[ \t]*' +
                escapeRegExp(end),
                'g'
            );
        }
        return this._lexer
    }

    /**
     * _findTagInBlocks
     * @param statement
     * @private
     */
    private _findTagInBlocks(statement: string): ITagConstructor | undefined {
        for (const Tag of tagMap.values()) {
            if (Tag.blocks.includes(statement)) {
                return Tag;
            }
        }
    }

    /**
     * _parse
     * @param node
     * @private
     */
    private _parse(node: Node) {
        const { _options } = this;
        // if (node instanceof Text && this.lexer instanceof RegExp) {
        if (node.nodeType === 3 && this.lexer instanceof RegExp) {
            const matches = node.nodeValue?.matchAll(this.lexer);
            if (matches) {
                for (const match of matches) {
                    const matchedNode = new MatchedNode(<Text>node, match, _options);
                    const { statement, expression } = <{ statement: string, expression: string }>matchedNode;
                    const Tag = tagMap.get(statement || ExpressionTag.statement) ||
                        this._findTagInBlocks(statement);
                    if (Tag && (Tag.statement === ExpressionTag.statement) && expression) {
                        // If tag is a standalone expression
                        const tag = new Tag(matchedNode, this._current, this._options);
                        this._current.push(tag);
                    } else if (Tag && (Tag.statement === statement)) {
                        // If tag corresponds to an opening statement, e.g. each or if, with or without expression
                        const tag = new Tag(matchedNode, this._current, this._options);
                        this._stack.push(tag);
                        this._current.push(tag);
                        if (Tag.blocks.length >0) {
                            this._current = tag.children;
                        }
                    } else if (Tag && Tag.blocks.includes(statement)) {
                        // If tag corresponds to a branch, e.g. else, or a closing statement in a block, e.g. endeach or endif
                        const isClosing = (Tag.blocks.indexOf(statement) === Tag.blocks.length - 1);
                        const main = isClosing ? this._stack.pop() : this._stack[this._stack.length - 1];
                        if (main instanceof Tag) {
                            main.matchedNodes.set(statement, matchedNode);
                            if (isClosing) {
                                this._current = main.parent;
                            }
                        } else {
                            // Possibly main could be undefined
                            throw new YumError(2000); // TODO Review code
                        }
                    } else {
                        throw new YumError(2000); // TODO Review code
                    }
                }
            }
        }
        if (node.hasChildNodes()) {
            const { childNodes } = node;
            // for (const child of childNodes) { - childNodes is not iterable
            for (let i = 0, { length } = childNodes; i < length; i++) {
                this._parse(childNodes.item(i));
            }
        }
    }

    /**
     * parse
     */
    parse () {
        for (const node of this._nodes) {
            this._parse(node);
        }
        // _stack should be empty and _current should be _ast;
        assert(this._stack.length === 0);
        assert(this._current === this._ast);
        return this._ast;
    }

}

// Assigned at runtime in TagParser.ts to resolve a circular dependency
// src/parts/TagParser.ts -> src/tags/tagMap.ts -> src/tags/EachTag.ts -> src/parts/TagParser.ts
AbstractTag.TagParser = TagParser;

/**
 * Default export
 */
export default TagParser