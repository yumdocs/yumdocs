import { DOMParser, XMLSerializer } from "../polyfills/xmldom";
import IPart from "./IPart";
import constants from "../constants";

/**
 * Part
 */
abstract class AbstractPart implements IPart {
    readonly priority: number = 5;
    protected _name: string;
    protected _type: string;
    protected _dom: Document;
    protected _parent: Map<string, IPart>;
    protected _options: Record<string, unknown>;
    protected _done = false;

    /**
     * Constructor
     * @param name
     * @param type
     * @param xml
     * @param parent
     * @param options
     * @protected
     */
    constructor(
        name: string,
        type: string,
        xml: string,
        parent: Map<string, IPart>,
        options: Record<string, unknown>
    ) {
        this._name = name;
        this._type = type;
        this._parent = parent; // The parent list of parts in YumTemplate
        this._options = options; // These options
        const ppXml = this._preProcess(xml);
        this._dom = new DOMParser().parseFromString(ppXml, constants.mimeType);
    }

    /**
     * name
     */
    get name() {
        return this._name;
    }

    /**
     * type
     */
    get type() {
        return this._type;
    }

    /**
     * done
     */
    get done() {
        return this._done;
    }

    /**
     * _preProcess
     * @param xml
     */
    protected _preProcess(xml: string): string {
        // Do nothing by default
        return xml;
    }

    /**
     * render
     * @param data
     */
    abstract render(data: Record<string, unknown>): Promise<void>

    /**
     * serialize
     */
    serialize(): string {
        return new XMLSerializer().serializeToString(this._dom);
    }
}

/**
 * Default export
 */
export default AbstractPart;