import IPart from "./IPart";
import AbstractPart from "./AbstractPart";

/**
 * IPartConstructor
 */
interface IPartConstructor {
    new(
        name: string,
        type: string,
        xml: string,
        parent: Map<string, IPart>,
        options: Record<string, unknown>
    ): AbstractPart
}

/**
 * IPartConstructor
 */
export default IPartConstructor;