import MatchedNode from './MatchedNode';
import AbstractTag from './AbstractTag';
import ITagContext from './ITagContext';

/**
 * ITagConstructor
 */
interface ITagConstructor {
    statement: string;
    blocks: Array<string>;
    new (
        node: MatchedNode,
        parent: Array<AbstractTag>,
        context: ITagContext,
    ): AbstractTag;
}

/**
 * Default export
 */
export default ITagConstructor;
