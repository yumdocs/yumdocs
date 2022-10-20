import {DOMParser} from '@xmldom/xmldom';
import {getChildrenOfCommonAncestor, getSiblingsBetween} from "../../src/tags/domUtils";

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<company name="Avengers">
    <addresses></addresses>
    <employees>
        <employee firstName="Peter" lastName="Parker"/>
        <employee firstName="Bruce" lastName="Banner"/>
        <employee firstName="Tony" lastName="Stark"/>
        <employee firstName="Bruce" lastName="Wayne"/>
    </employees>
</company>`;
const DOM = new DOMParser().parseFromString(XML, 'text/xml');

test('getChildrenOfCommonAncestor', () => {
    const company = DOM.childNodes[2];
    expect(company).toHaveProperty('nodeName', 'company');
    const employees = company.childNodes[3];
    expect(employees).toHaveProperty('nodeName', 'employees');
    const peterParker = employees.childNodes[1];
    expect(peterParker).toHaveProperty('nodeName', 'employee');
    const bruceWayne = employees.childNodes[7];
    expect(bruceWayne).toHaveProperty('nodeName', 'employee');
    const nodes = getChildrenOfCommonAncestor(peterParker, bruceWayne);
    for (const node of nodes) {
        expect(node.parentNode).toEqual(employees);
    }
});

test('getSiblingsBetween', () => {
    const company = DOM.childNodes[2];
    expect(company).toHaveProperty('nodeName', 'company');
    const employees = company.childNodes[3];
    expect(employees).toHaveProperty('nodeName', 'employees');
    const peterParker = employees.childNodes[1];
    expect(peterParker).toHaveProperty('nodeName', 'employee');
    const bruceWayne = employees.childNodes[7];
    expect(bruceWayne).toHaveProperty('nodeName', 'employee');
    const nodes = getSiblingsBetween(peterParker, bruceWayne);
    expect(nodes).toHaveProperty('length', 5);
});