import * as fs from '../../../src/polyfills/fs';

test('polyfills/fs', () => {
    expect(typeof fs.promises.mkdir).toEqual('function');
    expect(typeof fs.promises.readFile).toEqual('function');
    expect(typeof fs.promises.writeFile).toEqual('function');
});