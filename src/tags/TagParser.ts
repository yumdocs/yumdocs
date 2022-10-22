import constants from "../constants";
import {escapeRegExp} from "./tagUtils";
import MatchedNode from "./MatchedNode";
import AbstractTag from "./AbstractTag";
import tagMap from "./tagMap";
import ExpressionTag from "./ExpressionTag";
import ITagConstructor from "./ITagConstructor";
import {assert} from "../error/assert";

/**
 * TagParser
 */
class TagParser {
    private readonly _dom: Node;
    private _delimiters: { start: string, end: string };
    private _lexer: RegExp | undefined;
    private _ast: Array<AbstractTag> = [];
    private _current: Array<AbstractTag>;
    private _stack: Array<AbstractTag> = [];

    /**
     * constructor
     * @param dom
     * @param options
     */
    constructor(dom: Node, options: Record<string, unknown> = {}) {
        this._dom = dom;
        this._delimiters = <{ start: string, end: string }>(options.delimiters || constants.delimiters);
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
            this._lexer = new RegExp(
                escapeRegExp(this._delimiters.start) +
                '[ \t]*' +
                (statements.length? `(?<statement>${statements.join('|')})?[ \t]*` : '') +
                `(?<expression>[^${escapeRegExp(this._delimiters.end.slice(0,1))}]+)?` +
                '[ \t]*' +
                escapeRegExp(this._delimiters.end),
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
        // if (node instanceof Text && this.lexer instanceof RegExp) {
        if (node.nodeType === 3 && this.lexer instanceof RegExp) {
            const matches = node.nodeValue?.matchAll(this.lexer);
            if (matches) {
                for (const match of matches) {
                    const matchedNode = new MatchedNode(<Text>node, match);
                    const { statement, expression } = <{ statement: string, expression: string }>match.groups;
                    const Tag = tagMap.get(statement || ExpressionTag.statement) ||
                        this._findTagInBlocks(statement);
                    if (Tag && (Tag.statement === ExpressionTag.statement) && expression) {
                        // If tag is a standalone expression
                        const tag = new Tag(matchedNode, this._current);
                        this._current.push(tag);
                    } else if (Tag && (Tag.statement === statement)) {
                        // If tag corresponds to an opening statement, e.g. each or if, with or without expression
                        const tag = new Tag(matchedNode, this._current);
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
                            debugger;
                            // TODO throw?
                        }
                    } else {
                        debugger;
                        // TODO throw?
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
        this._parse(this._dom);
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