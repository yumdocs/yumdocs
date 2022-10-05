import handlebars from "handlebars";

/**
 * TemplateEngine
 */
class TemplateEngine {
    static compile(template: string) {
        return handlebars.compile(template);
    }
}

/**
 * Default export
 */
export default TemplateEngine;