import * as fs from '../../../src/polyfills/fs';
import YumError from '../../../src/error/YumError';

describe('fs polyfill', () => {
    test('promises', () => {
        expect(typeof fs.promises.mkdir).toEqual('function');
        expect(fs.promises.mkdir).toThrowError(YumError);
        expect(typeof fs.promises.readFile).toEqual('function');
        expect(fs.promises.readFile).toThrowError(YumError);
        expect(typeof fs.promises.writeFile).toEqual('function');
        expect(fs.promises.writeFile).toThrowError(YumError);
    });
});
