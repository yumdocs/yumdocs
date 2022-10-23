import {DOMImplementation, DOMParser, XMLSerializer} from '../../../src/polyfills/xmldom';

test('polyfills/xmldom', () => {
    expect(DOMImplementation).toBeInstanceOf(Function);
    expect(DOMParser).toBeInstanceOf(Function);
    expect(XMLSerializer).toBeInstanceOf(Function);
});