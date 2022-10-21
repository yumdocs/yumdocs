import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import TaggedNode from "./TaggedNode";
import {assert} from "../error/assert";
import {getChildrenOfCommonAncestor, getSiblingsBetween} from "./domUtils";
import expressionEngine from "./expressionEngine";

class IfTag extends AbstractTag implements ITag {
    static readonly statement = '#if';
    static readonly blocks: Array<string> = ['#else', '#endif'];

    /**
     * constructor
     * @param node
     * @param parent
     */
    constructor(node: TaggedNode, parent: Array<AbstractTag>) {
        super(node, parent);
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown> = {}) {
        debugger;
        const ifTaggedNode = this.nodes.get(IfTag.statement);
        const elseTaggedNode = this.nodes.get(IfTag.blocks[0]);
        const endTaggedNode = this.nodes.get(IfTag.blocks[1]);
        if (ifTaggedNode && endTaggedNode) {
            // Find the common parent node and child elements directly underneath,
            // respectively containing #if, #else and #endif
            const topNodes = elseTaggedNode instanceof TaggedNode ?
                getChildrenOfCommonAncestor(ifTaggedNode.node, elseTaggedNode.node, endTaggedNode.node) :
                getChildrenOfCommonAncestor(ifTaggedNode.node, endTaggedNode.node);
            assert(topNodes[0] === topNodes[topNodes.length - 1] || topNodes[0].parentNode === topNodes[topNodes.length - 1].parentNode);
            // Find siblings between #if and #else and between #else qnd #endif
            const ifSiblings = getSiblingsBetween(topNodes[0], topNodes[1]);
            const elseSiblings = elseTaggedNode instanceof TaggedNode ?
                getSiblingsBetween(topNodes[1], topNodes[2]) :
                [];
            // Evaluate #if condition
            const condition: boolean = <boolean>await expressionEngine.evaluate(ifTaggedNode.expression, data);
            debugger;
            // Update xmldom and ast
            if (condition) {
                // this.children;
            } else {

            }
            // Remove #if, #else and #endif
        }
    }
}

/**
 * Default export
 */
export default IfTag;