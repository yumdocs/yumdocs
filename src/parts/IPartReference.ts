import IPartConstructor from "./IPartConstructor";

/**
 * IPartReference
 */
interface IPartReference {
    name: string,
    type: string,
    Part: IPartConstructor // typeof AbstractPart
}

/**
 * Default export
 */
export default IPartReference