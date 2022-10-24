import {isNodeJS} from '../../../src/polyfills/polyfillsUtils';

test('polyfills/polyfillsUtils', () => {
   expect(isNodeJS).toEqual(true);
});