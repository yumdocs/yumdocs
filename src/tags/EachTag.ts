import AbstractTag from "./AbstractTag"; // <-- Use AbstractTag.TagParser to avoid a circular dependency
import ITag from "./ITag";
import MatchedNode from "./MatchedNode";
import {assert} from "../error/assert";
import {getChildrenOfCommonAncestor, getSiblingsBetween} from "./domUtils";
import expressionEngine from "./expressionEngine";

class EachTag extends AbstractTag implements ITag {
    static readonly statement = '#each';
    static readonly blocks: Array<string> = ['#endeach'];

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
        const eachMatchedNode = this.matchedNodes.get(EachTag.statement);
        const endMatchedNode = this.matchedNodes.get(EachTag.blocks[0]);
        if (eachMatchedNode && endMatchedNode) {
            // if #each and #endeach are part of the same node
            if (eachMatchedNode.node === endMatchedNode.node) {
                // TODO all in same node
            } else {
                // Find the common parent node and child elements directly underneath,
                // respectively containing #each and #endeach
                const topNodes = getChildrenOfCommonAncestor(eachMatchedNode.node, endMatchedNode.node);
                assert(topNodes[0].parentNode === topNodes[1].parentNode);
                // Find siblings to repeat between #each and #endeach
                const siblings = getSiblingsBetween(topNodes[0], topNodes[1]);
                // Evaluate #each expression, which should be an array
                const arr = await expressionEngine.evaluate(eachMatchedNode.expression, data);
                if (!Array.isArray(arr)) {
                    // TODO What if arr is not an array?
                    return;
                }
                // Update xmldom and ast
                const parent = <Node>topNodes[0].parentNode;
                for (let i = 1; i < arr.length; i++) {
                    // Duplicate siblings for each array item
                    for (const sibling of siblings) {
                        const node = sibling.cloneNode(true);
                        parent.insertBefore(node, topNodes[1]);
                        // Parse new node
                        const _ast = new AbstractTag.TagParser(node).parse(); // TODO options with delimiters
                        // Add to document ast
                        this.children.push(..._ast);
                    }
                }
                // Remove #each and #endeach
                parent.removeChild(topNodes[0]);
                parent.removeChild(topNodes[1]);
                // Process children
                for (let i = 0; i < this.children.length; i++) {
                    await this.children[i].render(arr[Math.trunc(i / siblings.length)]);
                }
            }
            this._done = true;
        }
    }
}

/**
 * Default export
 */
export default EachTag;