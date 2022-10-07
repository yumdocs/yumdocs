import ExpressionSearch from "../src/ExpressionSearch";
import { DOMParser } from '@xmldom/xmldom';

const XML = `<?xml version="1.0"?>
<note>
<to>{{dummy1}}</to>
<from>Jani</from>
<heading>{{dummy2}}</heading>
<body>Don't forget me this weekend!</body>
</note>`;

test('OpenXMLSearch', () => {
    const dom = new DOMParser().parseFromString(XML, 'text/xml');
    const search = new ExpressionSearch(dom);
    const ret = search.filter();
    expect(ret).toBeInstanceOf(Array);
    expect(ret.length).toEqual(2);
});
