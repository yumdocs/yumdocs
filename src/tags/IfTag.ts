import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import MatchedNode from "./MatchedNode";
import {assert} from "../error/assert";
import {contains, getChildrenOfCommonAncestor, getSiblingsBetween} from "./domUtils";
import expressionEngine from "./expressionEngine";

class IfTag extends AbstractTag implements ITag {
    static readonly statement = '#if';
    static readonly blocks: Array<string> = ['#else', '#endif'];

    /**
     * constructor
     * @param matchedNode
     * @param parent
     */
    constructor(matchedNode: MatchedNode, parent: Array<AbstractTag>) {
        super(matchedNode, parent);
    }

    /**
     * render
     * @param data
     */
    async render(data: Record<string, unknown> = {}) {
        const ifMatchedNode = this.matchedNodes.get(IfTag.statement);
        const elseMatchedNode = this.matchedNodes.get(IfTag.blocks[0]);
        const endMatchedNode = this.matchedNodes.get(IfTag.blocks[1]);
        if (ifMatchedNode && endMatchedNode) {
            // Find the common parent node and child elements directly underneath,
            // respectively containing #if, #else and #endif
            const topNodes = elseMatchedNode instanceof MatchedNode ?
                getChildrenOfCommonAncestor(ifMatchedNode.node, elseMatchedNode.node, endMatchedNode.node) :
                getChildrenOfCommonAncestor(ifMatchedNode.node, endMatchedNode.node);
            assert(topNodes[0] === topNodes[topNodes.length - 1] || topNodes[0].parentNode === topNodes[topNodes.length - 1].parentNode);
            // Find siblings between #if and #else and between #else qnd #endif
            const ifSiblings = getSiblingsBetween(topNodes[0], topNodes[1]);
            const elseSiblings = elseMatchedNode instanceof MatchedNode ?
                getSiblingsBetween(topNodes[1], topNodes[2]) :
                [];
            // Evaluate #if condition
            const condition: boolean = <boolean>await expressionEngine.evaluate(ifMatchedNode.expression, data);
            // TODO What if condition is not boolean???? What about truthy/falsy?
            // Update xmldom and ast
            const parent = <Node>topNodes[0].parentNode;
            for (const sibling of condition? elseSiblings : ifSiblings) {
                // Remove tags from ast where condition is not met
                for (let i = this.children.length - 1; i >= 0; i--) {
                    const [matchedNode] = this.children[i].matchedNodes.values();                    debugger;
                    if (contains(sibling, matchedNode.node)) {
                        this.children.splice(i, 1);
                    }
                }
                // remove nodes from DOM
                parent.removeChild(sibling);
            }
            // Remove #if, #else and #endif
            topNodes.forEach(node => { parent.removeChild(node); });
            // Process children where condition is met (others have been removed)
            for (let i = 0; i < this.children.length; i++) {
                await this.children[i].render(data);
            }
        }
    }
}

/**
 * Default export
 */
export default IfTag;