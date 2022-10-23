import {isNode} from '../../../src/polyfills/polyfillsUtils';

test('polyfills/polyfillsUtils', () => {
   expect(isNode).toEqual(true);
});