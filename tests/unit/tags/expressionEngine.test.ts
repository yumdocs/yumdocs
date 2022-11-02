import angular from 'angular-expressions';
import jmespath from 'jmespath';
import { faker } from "@faker-js/faker";
import expressionEngine from "../../../src/tags/expressionEngine";

const DATA = {
    text: faker.datatype.string(),
    number: faker.datatype.number(),
    boolean: faker.datatype.boolean(),
    date: faker.datatype.datetime(),
}

describe('Basic test', () => {
    test('Simple expression', async () => {
        const ret = await expressionEngine.evaluate('text', DATA);
        expect(ret).toEqual(DATA.text);
    });
});

describe('Functions', () => {
    test('$min', async () => {
        const ret = await expressionEngine.evaluate('number + $min(0,number)', DATA);
        expect(ret).toEqual(DATA.number + Math.min(0, DATA.number));
    });
});

describe('Transforms', () => {
    test('lower', async () => {
        const ret = await expressionEngine.evaluate('text|lower', DATA);
        expect(ret).toEqual(DATA.text.toLowerCase());
    });
    test('substr', async () => {
        const ret = await expressionEngine.evaluate('text|substr(0,2)', DATA);
        expect(ret).toEqual(DATA.text.substring(0,2));
    });
    test('upper', async () => {
        const ret = await expressionEngine.evaluate('text|upper', DATA);
        expect(ret).toEqual(DATA.text.toUpperCase());
    });
});

describe('Configure other expressions engines', () => {
    test('Jmespath', async () => {
        function evaluate(expression: string, context: Record<string, unknown>): Promise<unknown> {
            return new Promise((resolve /*, reject */) => {
                const ret = jmespath.search(context, expression);
                resolve(ret);
            });
        }

        expressionEngine.setEval(evaluate);
        const ret = await expressionEngine.evaluate('text', DATA);
        expect(ret).toEqual(DATA.text);
    });

    test('Angular expressions', async () => {
        function evaluate(expression: string, context: Record<string, unknown>): Promise<unknown> {
            return new Promise((resolve /*, reject */) => {
                const fn = angular.compile(expression);
                const ret = fn(context);
                resolve(ret);
            });
        }

        expressionEngine.setEval(evaluate);
        const ret = await expressionEngine.evaluate('text', DATA);
        expect(ret).toEqual(DATA.text);
    });
});
