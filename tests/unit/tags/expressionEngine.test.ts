import angular from 'angular-expressions';
import jmespath from 'jmespath';
import { faker } from "@faker-js/faker";
import expressionEngine from "../../../src/tags/expressionEngine";

const DATA = {
    boolean: faker.datatype.boolean(),
    date: faker.datatype.datetime(),
    number: faker.datatype.number(),
    text: faker.datatype.string(),
    words: new Array(1 + Math.trunc(10 * Math.random())).fill('').map(() => faker.random.words()),
    persons: new Array(1 + Math.trunc(10 * Math.random())).fill({}).map(() => ({
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
        age: faker.datatype.number({min: 18, max: 100, precision: 0})
    })),
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
    // String
    test('lower', async () => {
        const ret = await expressionEngine.evaluate('text|lower', DATA);
        expect(ret).toEqual(DATA.text.toLowerCase());
    });
    xtest('replace', async () => { // TODO: too many errors
        console.log(DATA.text);
        const search = DATA.text.substring(Math.floor(DATA.text.length/2), Math.ceil(DATA.text.length/2) + 1).replace(/(^\\)"/g, '$1\\"');
        const replace = faker.datatype.string().replace(/(^\\)"/g, '$1\\"');
        console.log(search + ' ---> ' + replace);
        const ret = await expressionEngine.evaluate(`text|replace("${search}","${replace}")`, DATA);
        expect(ret).toEqual(DATA.text.replace(search,replace));
    });
    test('substr', async () => {
        const ret = await expressionEngine.evaluate('text|substr(0,2)', DATA);
        expect(ret).toEqual(DATA.text.substring(0,2));
    });
    test('upper', async () => {
        const ret = await expressionEngine.evaluate('text|upper', DATA);
        expect(ret).toEqual(DATA.text.toUpperCase());
    });

    // Number and Date
    test('format', async () => {
        const ret = await expressionEngine.evaluate('number|format("c", "en-US")', DATA);
        expect(ret).toMatch(/^\$\d{1,3}(,\d{3})*\.\d{2}$/);
    });

    // Array
    test('join', async () => {
        const ret = await expressionEngine.evaluate('words|join(",")', DATA);
        expect(ret).toEqual(DATA.words.join(','));
    });
    test('orderBy', async () => {
        let ret = await expressionEngine.evaluate('words|orderBy', DATA);
        expect(ret).toEqual(DATA.words);
        ret = await expressionEngine.evaluate('persons|orderBy("age", true)', DATA);
        expect(ret).toEqual(DATA.persons.sort((a, b) => a.age - b.age));
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
