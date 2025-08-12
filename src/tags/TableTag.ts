import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import MatchedNode from "./MatchedNode";
import ITagContext from "./ITagContext";

class TableTag extends AbstractTag implements ITag {
    static readonly statement = '#table';
    static readonly blocks: Array<string> = ['#tablesum', '#endtable'];

    /**
     * constructor
     * @param matchedNode
     * @param parent
     * @param options
     */
    constructor(matchedNode: MatchedNode, parent: Array<AbstractTag>, context: ITagContext) {
        super(matchedNode, parent, context);
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown> = {}) {
        // TODO Consider Kendo UI Spreadsheet json
        const tableMatchedNode = this.matchedNodes.get(TableTag.statement);
        const sumMatchedNode = this.matchedNodes.get(TableTag.blocks[0])
        const endMatchedNode = this.matchedNodes.get(TableTag.blocks[1]);
    }
}

/**
 * Default export
 */
export default TableTag;