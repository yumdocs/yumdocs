import {YumError, YumTemplate, expressionEngine} from '../../src/index';

describe('Entry Points', () => {
    test('YumError', () => {
       expect(YumError).toBeInstanceOf(Function);
    });

    test('YumTemplate', () => {
        expect(YumTemplate).toBeInstanceOf(Function);
    });

    test('expressionEngine', () => {
        // Note: required for our ExpressionPlayground considering configuration
        expect(expressionEngine).toHaveProperty('evaluate');
    });
});
