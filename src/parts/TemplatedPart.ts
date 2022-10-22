import AbstractPart from "./AbstractPart";
import IPart from "./IPart";
import {sanitizeWordMarkup} from '../word/wordUtils';
import TagParser from "../tags/TagParser";
import AbstractTag from "../tags/AbstractTag";
import {sanitizePptMarkup} from "../ppt/pptUtils";

/**
 * TemplatedPart
 */
class TemplatedPart extends AbstractPart {
    readonly priority: number = 1;
    private _ast: Array<AbstractTag> = [];

    /**
     * constructor
     * @param name
     * @param type
     * @param xml
     * @param parent
     * @param options
     */
    constructor(
        name: string,
        type: string,
        xml: string,
        parent: Map<string, IPart>,
        options: Record<string, unknown>
    ) {
        super(name, type, xml, parent, options);
        this._ast = new TagParser(this._dom, options).parse();
    }

    /**
     * _preProcess
     * Note: executed by parent AbstractPart
     * @param xml
     */
    protected _preProcess(xml: string): string {
        const { start, end } = <{ start: string, end: string }>this._options.delimiters;
        // TODO escape characters like < and >
        const pos1 = xml.indexOf(start.slice(0,1));
        const pos2 = pos1 > -1 ? xml.indexOf(end.slice(-1), pos1 + 1) : -1;
        // No need to sanitize if we cannot find the first and last characters of delimiters
        if (this._name.startsWith('word/') && pos1 > 0 && pos2 > 0) {
            return sanitizeWordMarkup(xml, {start, end});
        } else if (this._name.startsWith('ppt/') && pos1 > 0 && pos2 > 0) {
            return sanitizePptMarkup(xml, {start, end});
        } else {
            // Do nothing by default
            return super._preProcess(xml);
        }
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown>) {
        if (this._done) return;
        for (const tag of this._ast) {
            await tag.render(data);
        }
        this._done = true;
        // return this._dom; // for testing purpose only
    }
}

/**
 * Default export
 */
export default TemplatedPart;