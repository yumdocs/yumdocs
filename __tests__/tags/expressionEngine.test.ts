import angular from 'angular-expressions';
import { faker } from "@faker-js/faker";
import expressionEngine from "../../src/tags/expressionEngine";

const DATA = {
    dummy: faker.random.word(),
}

test('Simple expression', async () => {
    const ret = await expressionEngine.evaluate('dummy', DATA);
    expect(ret).toEqual(DATA.dummy);
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
    const ret = await expressionEngine.evaluate('dummy', DATA);
    expect(ret).toEqual(DATA.dummy);
});

