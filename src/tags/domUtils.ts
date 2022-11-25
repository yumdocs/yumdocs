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

/**
 * contains
 * @param parent
 * @param child
 */
export function contains(parent: Node, child: Node): boolean {
    if(child === parent) return true;
    let current = child;
    while(current.parentNode) {
        if (current.parentNode === parent) {
            return true;
        }
        current = current.parentNode;
    }
    return false;
}

/**
 * indexOfNode
 * @param list
 * @param node
 */
export function indexOfNode(list: NodeListOf<ChildNode>, node: Node) {
    let index = 0;
    let found = false;
    for (; index < list.length; index++) {
        if (list[index] === node) {
            found = true;
            break;
        }
    }
    return found? index : -1;
}

/**
 * cloneRunFromText
 * @param text
 * @param data
 */
export function cloneRunFromText(element: Text, data: string) {
    const text = <Node>element.parentNode;
    const j = indexOfNode(text.childNodes, element);
    const run = <Node>text.parentNode;
    const i = indexOfNode(run.childNodes, text);
    const ret = run.cloneNode(true);
    const retElement = <Text>ret.childNodes[i].childNodes[j];
    retElement.replaceData(0, retElement.length, data);
    return ret;
}