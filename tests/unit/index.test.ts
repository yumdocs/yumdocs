import {YumError, YumTemplate} from '../../src/index';

describe('Entry Points', () => {
    test('YumError', () => {
       expect(YumError).toBeInstanceOf(Function);
    });

    test('YumTemplate', () => {
        expect(YumTemplate).toBeInstanceOf(Function);
    });
});
