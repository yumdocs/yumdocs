import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import IPart from "./IPart";

/**
 * Part
 */
abstract class AbstractPart implements IPart {
    readonly priority: number = 5;
    protected _name: string;
    protected _type: string;
    protected _dom: Document;
    protected _parent: Map<string, IPart>;
    protected _done = false;

    /**
     * Constructor
     * @param name
     * @param type
     * @param xml
     * @param parent
     * @protected
     */
    constructor(
        name: string,
        type: string,
        xml: string,
        parent: Map<string, IPart>
    ) {
        this._name = name;
        this._type = type;
        this._parent = parent; // The parent list of parts in OpenXMLTemplate

        const output = this._preProcess(xml);
        this._dom = new DOMParser().parseFromString(output, 'text/xml');
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
    abstract render(data: any): void

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