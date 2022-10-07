import PartRendererInterface from './PartRendererInterface';
import DefaultNodeRenderer from '../nodes/DefaultNodeRenderer';
import ExpressionSearch from "../ExpressionSearch";

class DefaultPartRenderer implements PartRendererInterface {
    private _dom: Document;
    private _nodes: any[];

    /**
     * constructor
     * @param dom
     */
    constructor(dom: Document) {
        this._dom = dom;
        const search = new ExpressionSearch(this._dom);
        this._nodes = search.filter();
    }

    /**
     * render
     * @param data
     */
    render(data: any) {
        for (let i = 0; i < this._nodes.length; i++) {
            const node = this._nodes[i];
            // TODO use correct renderer
            new DefaultNodeRenderer(node).render(data);
        }
        return this._dom;
    }
}

/**
 * Default export
 */
export default DefaultPartRenderer;