/**
 * IPart
 */
interface IPart {
    readonly done: boolean,
    readonly priority: number,
    readonly name: string,
    readonly type: string,
    /* async */ render(data: any): void,
    serialize(): string
}

/**
 * Default export
 */
export default IPart;