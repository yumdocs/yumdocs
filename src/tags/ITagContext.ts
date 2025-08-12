import ITagParser from './ITagParser';
import OptionsType from '../OptionsType';

/**
 * ITagContext
 * Provides dependencies for tag construction, eliminating circular dependencies
 */
interface ITagContext {
    /**
     * TagParser constructor for creating nested parsers
     */
    createTagParser(nodes: Array<Node>, options: OptionsType): ITagParser;
    
    /**
     * Template options
     */
    options: OptionsType;
}

export default ITagContext;