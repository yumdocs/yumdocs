import constants from "../constants";
import OptionsType from "../OptionsType";

/**
 * MatchNode
 */
class MatchedNode {
    public readonly node: Text;
    private readonly _match: Array<string>;
    private readonly _options: OptionsType;

    /**
     * constructor
     * @param node
     * @param match
     * @param options
     */
    constructor(node: Text, match: Array<string>, options: OptionsType) {
        this.node = node;
        this._match = match;
        this._options = options;
    }

    /**
     * statement
     */
    get statement(): string {
        // @ts-expect-error TS2339: Property 'groups' does not exist on type 'string[]'.
        return this._match.groups.statement;
    }

    /**
     * expression
     */
    get expression(): string {
        // @ts-expect-error TS2339: Property 'groups' does not exist on type 'string[]'.
        return this._match.groups.expression;
    }

    /**
     * nodeValue
     */
    get nodeValue(): string | null {
        return this.node.nodeValue;
    }

    /**
     * replaceMatch
     * Note: This mainly replaces expressions and tags
     * @param data
     */
    replaceMatch(data: string) {
        const tag: string = this._match[0];
        // const offset: number = this._match.index; // This might not be accurate if another replacement has already been done
        const offset: number = (this.node.nodeValue || constants.empty).indexOf(tag);
        const count: number = tag.length;
        return this.node.replaceData(offset, count, data);
    }

    /**
     * replaceMatchAndBefore
     * Note: This is mainly used for the #if tag
     * @param data
     */
    replaceMatchAndBefore(data: string) {
        const tag: string = this._match[0];
        let offset: number = (this.node.nodeValue || constants.empty).indexOf(tag);
        let count: number = tag.length;
        const end = <string>this._options.delimiters?.end;
        const pos = (this.node.nodeValue || constants.empty).indexOf(end);
        if (pos < offset) {
            // There is another tag ending at pos + end.length before
            count = offset - pos - end.length + count;
            offset = pos + end.length;
        } else {
            // There is no other tag before
            count = offset + count;
            offset = 0;
        }
        return this.node.replaceData(offset, count, data);
    }

    /**
     * replaceMatchAndAfter
     * Note: This is mainly used for the #if tag
     * @param data
     */
    replaceMatchAndAfter(data: string) {
        const tag: string = this._match[0];
        const offset: number = (this.node.nodeValue || constants.empty).indexOf(tag);
        let count: number;
        const start = <string>this._options.delimiters?.start;
        const pos = (this.node.nodeValue || constants.empty).indexOf(start, offset + 1);
        if (pos > offset) {
            // There is another tag starting at pos after
            count = pos - offset;
        } else {
            // There is no other tag after
            count = (this.node.nodeValue || constants.empty).length - offset;
        }
        return this.node.replaceData(offset, count, data);
    }
}

/**
 * Default export
 */
export default MatchedNode;