import AbstractTag from "./AbstractTag";
import ITag from "./ITag";
import MatchedNode from "./MatchedNode";
import {assert} from "../error/assert";
import {contains, getChildrenOfCommonAncestor, getSiblingsBetween} from "./domUtils";
import expressionEngine from "./expressionEngine";
import YumError from "../error/YumError";
import constants from "../constants";
import OptionsType from "../OptionsType";

class IfTag extends AbstractTag implements ITag {
    static readonly statement = '#if';
    static readonly blocks: Array<string> = ['#else', '#endif'];

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
            let condition: boolean;
            try {
                // Note: a condition which is truthy/falsy get converted to true/false
                condition = <boolean>await expressionEngine.evaluate(ifMatchedNode.expression, data);
            } catch(error) {
                throw new YumError( 1060,{error, data: { expression: ifMatchedNode.expression, data }});
            }
            // Update xmldom and ast
            const parent = <Node>topNodes[0].parentNode;
            for (const sibling of condition? elseSiblings : ifSiblings) {
                // Remove tags from ast where condition is not met
                for (let i = this.children.length - 1; i >= 0; i--) {
                    const [matchedNode] = this.children[i].matchedNodes.values();
                    if (contains(sibling, matchedNode.node)) {
                        this.children.splice(i, 1);
                    }
                }
                // remove nodes from DOM
                parent.removeChild(sibling);
            }
            // Process #if node
            const removeNodes: Array<Node> = [];
            if ((!condition && elseMatchedNode instanceof MatchedNode) ||
                (condition && !(elseMatchedNode instanceof MatchedNode))){
                ifMatchedNode.replaceMatchAndAfter(constants.empty)
            } else {
                ifMatchedNode.replaceMatch(constants.empty);
            }
            if (ifMatchedNode.nodeValue === constants.empty) {
                removeNodes.push(topNodes[0]);
            }
            // Process #else node
            if (elseMatchedNode instanceof MatchedNode) {
                if (condition) {
                    elseMatchedNode.replaceMatchAndAfter(constants.empty);
                } else {
                    elseMatchedNode.replaceMatchAndBefore(constants.empty);
                }
                if (elseMatchedNode.nodeValue === constants.empty) {
                    removeNodes.push(topNodes[1]);
                }
            }
            // Process #end node
            if ((condition && elseMatchedNode instanceof MatchedNode) ||
                (!condition && !(elseMatchedNode instanceof MatchedNode))){
                endMatchedNode.replaceMatchAndBefore(constants.empty)
            } else {
                endMatchedNode.replaceMatch(constants.empty);
            }
            if (endMatchedNode.nodeValue === constants.empty) {
                removeNodes.push(topNodes[topNodes.length - 1]);
            }
            // Remove #if, #else and #endif
            removeNodes.forEach(node => {
                parent.removeChild(node);
            });
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