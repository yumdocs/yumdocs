import IExpression from './IExpression';

/**
 * AbstractExpression
 */
abstract class AbstractExpression implements IExpression {
    startNode: any;
    endNode?: any;
    done: boolean;
    abstract render(data: any): void
}

/**
 * Default export
 */
export default AbstractExpression;