import AbstractTag from "./AbstractTag"; // <-- Use AbstractTag.TagParser to avoid a circular dependency
import ITag from "./ITag";
import MatchedNode from "./MatchedNode";
import {assert} from "../error/assert";
import {contains, getChildrenOfCommonAncestor, getSiblingsBetween} from "./domUtils";
import expressionEngine from "./expressionEngine";
import YumError from "../error/YumError";
import OptionsType from "../OptionsType";

class EachTag extends AbstractTag implements ITag {
    static readonly statement = '#each';
    static readonly blocks: Array<string> = ['#endeach'];

    /**
     * constructor
     * @param matchedNode
     * @param parent
     * @param options
     */
    constructor(matchedNode: MatchedNode, parent: Array<AbstractTag>, options: OptionsType) {
        super(matchedNode, parent, options);
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
                let arr: unknown; // avoid Array<unknown> because a value which is not an array becomes new Array(value);
                try {
                    arr = await expressionEngine.evaluate(eachMatchedNode.expression, data);
                } catch (error) {
                    throw new YumError(1060, {error, data: { expression: eachMatchedNode.expression, data }});
                }
                if (typeof arr === 'undefined') {
                    arr = [];
                } else if (!Array.isArray(arr)) {
                    throw new YumError(1110, {data: { expression: eachMatchedNode.expression, data }});
                }
                const array = arr as Array<Record<string, unknown>>;
                // Update xmldom and ast
                const parent = <Node>topNodes[0].parentNode;
                if (array.length === 0) {
                    for (const sibling of siblings) {
                        // Remove tags from ast
                        for (let i = this.children.length - 1; i >= 0; i--) {
                            const [matchedNode] = this.children[i].matchedNodes.values();
                            if (contains(sibling, matchedNode.node)) {
                                this.children.splice(i, 1);
                            }
                        }
                        // remove nodes from DOM
                        parent.removeChild(sibling);
                    }
                } else {
                    for (let i = 1; i < array.length; i++) {
                        // Duplicate siblings for each array item
                        for (const sibling of siblings) {
                            const node = sibling.cloneNode(true);
                            parent.insertBefore(node, topNodes[1]);
                            // Parse new node
                            const _ast = new AbstractTag.TagParser(node, this._options).parse(); // TODO options with delimiters
                            // Add to document ast
                            this.children.push(..._ast);
                        }
                    }
                }
                // Remove #each and #endeach
                topNodes.forEach(node => { parent.removeChild(node); });
                // Process children
                for (let i = 0; i < this.children.length; i++) {
                    await this.children[i].render(array[Math.trunc(i / siblings.length)]);
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