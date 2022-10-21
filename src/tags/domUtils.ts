/**
 * getCommonAncestor
 * @param nodes
 */
import {assert} from "../error/assert";

export function getChildrenOfCommonAncestor(...nodes: Array<Node>): Array<Node> {
    // @see https://stackoverflow.com/questions/3960843/how-to-find-the-nearest-common-ancestors-of-two-or-more-nodes
    const ret: Array<Node> = [...nodes];
    if (!ret.every(node => node === ret[0])) {
        // If all nodes are not identical
        // Check each parentNode until they are all identical or root is reached
        while (
            ret.slice(1).every(node => node.parentNode !== ret[0].parentNode) &&
            ret.every(node => node.parentNode !== ret[0].ownerDocument)
            ) {
            for (let i = 0; i < ret.length; i++) {
                ret[i] = <Node>ret[i].parentNode;
            }
        }
    }
    return ret;
}

/**
 * getSiblingsBetween
 * Note: beware! returns an empty array if node1 === node2 (or node2 prior to node1)
 * @param node1
 * @param node2
 */
export function getSiblingsBetween(node1: Node, node2: Node): Array<Node> {
    assert(node1.parentNode === node2.parentNode);
    const ret: Array<Node> = [];
    if (node1 !== node2) {
        let current = node1;
        // add siblings to ret array until we reach either node2 or null (last sibling)
        do {
            if (current.nextSibling) {
                current = current.nextSibling;
                ret.push(current);
            } else {
                break;
            }
        } while (current.nextSibling !== node2)
        // if we have reached the last sibling without reaching node2
        if (current.nextSibling !== node2) {
            ret.splice(0, ret.length); // empty
        }
    }
    return ret;
}