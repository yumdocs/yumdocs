import YumError from '../../../src/error/YumError';
import errorCodes from '../../../src/error/errorCodes';
import { faker } from '@faker-js/faker';

// TODO Test options error and data

test('Missing error code', () => {
    const code = faker.datatype.number({ min: 0, max: 999});
    function test() {
        throw new YumError(code);
    }
    expect(test).toThrow(YumError);
    expect(test).toThrow(`Missing error code ${code}`);
});

test('Unknown error', () => {
    const code = 1000;
    function test() {
        throw new YumError(code);
    }
    expect(test).toThrow(YumError);
    expect(test).toThrow(errorCodes.get(code)?.message);
    expect(test).toThrow('Unknown error');
});