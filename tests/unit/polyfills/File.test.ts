import {Blob, File, saveAs} from '../../../src/polyfills/File';

test('polyfills/File', () => {
    expect(Blob).toBeInstanceOf(Function);
    expect(File).toBeInstanceOf(Function);
    expect(typeof saveAs).toEqual('function');
});