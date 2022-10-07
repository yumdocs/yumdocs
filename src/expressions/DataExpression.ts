import AbstractExpression from "./AbstractExpression";
import handlebars from "handlebars";

/**
 * DataExpression
 */
class DataExpression extends AbstractExpression {
    /**
     * Render
     * @param data
     */
    render(data: any) {
        // Merge with data
        const template = handlebars.compile(this.startNode.nodeValue);
        this.startNode.replaceData(0, (this.startNode.nodeValue || '').length, template(data));
    }
}

/**
 * Default export
 */
export default DataExpression;