import constants from "../constants";
import {escapeRegExp} from "../tags/tagUtils";
import TaggedNode from "../tags/TaggedNode";
import AbstractTag from "../tags/AbstractTag";
import tagMap from "../tags/tagMap";

/**
 * TagParser
 */
class TagParser {
    private _dom: Document;
    private _delimiters: { start: string, end: string };
    private _lexer: RegExp | undefined;
    private _tree: Array<AbstractTag> = [];
    private _stack = [];

    /**
     * constructor
     * @param dom
     * @param options
     */
    constructor(dom: Document, options: Record<string, unknown> = {}) {
        this._dom = dom;
        this._delimiters = <{ start: string, end: string }>(options.delimiters || constants.delimiters);
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
            // Get registered *Token statements
            for (const Tag of tagMap.values()) {
                statements
                    .push(
                        ...Tag.statements
                        .filter(statement => !!statement )
                        .map(statement => escapeRegExp(statement))
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

    private _findTag(tag: string): AbstractTag | undefined {
        let ret: AbstractTag | undefined;
        for (const Tag in tagMap.values()) {
            // if (tag in Tag.statements) {

            // }
        }
        return ret;
    }

    /**
     * _parse
     * @param node
     * @private
     */
    private _parse(node: Node) {
        if (node instanceof Text && this.lexer instanceof RegExp) {
            const matches = node.nodeValue?.matchAll(this.lexer);
            if (matches) {
                for (const match of matches) {
                    const taggedNode = new TaggedNode(node, match);
                    const { statement } = <{ statement: string }>match.groups;
                    const Tag = tagMap.get(statement);
                    if (Tag ) {
                        this._tree.push(new Tag(taggedNode));
                        // Todo
                    } else {
                        // TODO
                    }
                }
            }
        }
        if (node.hasChildNodes()) {
            for (const child of node.childNodes) {
                this._parse(child);
            }
        }
    }

    /**
     * parse
     */
    parse () {
        // TODO Check tree;
        this._parse(this._dom);
        return this._tree;
    }

}

/**
 * Default export
 */
export default TagParser