import handlebars from "handlebars";

/**
 * DefaultNodeRenderer
 */
class DefaultNodeRenderer {
    private _node: Text;

    /**
     * constructor
     * @param node
     */
    constructor(node: Text) {
        this._node = node;
    }

    /**
     * render
     * @param data
     */
    render(data: any) {
        // Merge with data
        const template = handlebars.compile(this._node.nodeValue);
        this._node.replaceData(0, (this._node.nodeValue || '').length, template(data));
    }
}

/**
 * Default export
 */
export default DefaultNodeRenderer;