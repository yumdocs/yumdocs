import * as fs from '../../../src/polyfills/fs';
import YumError from '../../../src/error/YumError';

describe('fs polyfill', () => {
    test('promises', () => {
        expect(typeof fs.promises.mkdir).toEqual('function');
        expect(fs.promises.mkdir).toThrow(YumError);
        expect(typeof fs.promises.readFile).toEqual('function');
        expect(fs.promises.readFile).toThrow(YumError);
        expect(typeof fs.promises.writeFile).toEqual('function');
        expect(fs.promises.writeFile).toThrow(YumError);
    });
});
