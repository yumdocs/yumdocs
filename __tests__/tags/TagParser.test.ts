import {DOMParser} from "@xmldom/xmldom";
import TagParser from '../../src/tags/TagParser';
import constants from "../../src/constants";
import {escapeRegExp} from "../../src/tags/tagUtils";

test('lexer with builtin delimiters', () => {
    const {delimiters} = constants;
    const XML = `<?xml version="1.0" encoding="UTF-8"?>
        <node>Bonjour ${delimiters.start}#if employee.gender${delimiters.end}Mr${delimiters.start}#else${delimiters.end}Ms.${delimiters.start}#endif${delimiters.end} ${delimiters.start}employee.fullName | format${delimiters.end},</node>`;
    const dom = new DOMParser().parseFromString(XML, 'text/xml');
    const parser = new TagParser(dom);
    const {lexer} = parser;
    const str = lexer?.toString();
    const start = escapeRegExp(delimiters.start);
    const end = escapeRegExp(delimiters.end);
    expect(str?.slice(0, start.length + 1)).toEqual(`/${start}`);
    expect(str?.slice(-end.length - 2)).toEqual(`${end}/g`);
    const matches = XML.matchAll(<RegExp>lexer);
    let count = 0;
    for (const match of matches) {
        expect(match.groups).toHaveProperty('statement');
        expect(match.groups).toHaveProperty('expression');
        count ++;
    }
    expect(count).toEqual(XML.split(delimiters.start).length - 1);
});

test('lexer with custom delimiters', () => {
    const delimiters = {
        start: '${',
        end: '}'
    };
    const XML = `<?xml version="1.0" encoding="UTF-8"?>
        <node>Bonjour ${delimiters.start}#if employee.gender${delimiters.end}Mr${delimiters.start}#else${delimiters.end}Ms.${delimiters.start}#endif${delimiters.end} ${delimiters.start}employee.fullName | format${delimiters.end},</node>`;
    const dom = new DOMParser().parseFromString(XML, 'text/xml');
    const parser = new TagParser(dom, {delimiters});
    const {lexer} = parser;
    const str = lexer?.toString();
    const start = escapeRegExp(delimiters.start);
    const end = escapeRegExp(delimiters.end);
    expect(str?.slice(0, start.length + 1)).toEqual(`/${start}`);
    expect(str?.slice(-end.length - 2)).toEqual(`${end}/g`);
    const matches = XML.matchAll(<RegExp>lexer);
    let count = 0;
    for (const match of matches) {
        expect(match.groups).toHaveProperty('statement');
        expect(match.groups).toHaveProperty('expression');
        count ++;
    }
    expect(count).toEqual(XML.split(delimiters.start).length - 1);
});

// TODO
xtest('lexer with custom delimiters that mess with XML', () => {
    const delimiters = {
        start: '<%',
        end: '%>'
    };
    const XML = `<?xml version="1.0" encoding="UTF-8"?>
        <node>Bonjour ${delimiters.start}#if employee.gender${delimiters.end}Mr${delimiters.start}#else${delimiters.end}Ms.${delimiters.start}#endif${delimiters.end} ${delimiters.start}employee.fullName | format${delimiters.end},</node>`;
    const dom = new DOMParser().parseFromString(XML, 'text/xml');
    const parser = new TagParser(dom, {delimiters});
    const {lexer} = parser;
    const str = lexer?.toString();
    const start = escapeRegExp(delimiters.start);
    const end = escapeRegExp(delimiters.end);
    expect(str?.slice(0, start.length + 1)).toEqual(`/${start}`);
    expect(str?.slice(-end.length - 2)).toEqual(`${end}/g`);
    const matches = XML.matchAll(<RegExp>lexer);
    let count = 0;
    for (const match of matches) {
        expect(match.groups).toHaveProperty('statement');
        expect(match.groups).toHaveProperty('expression');
        count ++;
    }
    expect(count).toEqual(XML.split(delimiters.start).length - 1);
});

test('Parser', () => {
    const {delimiters} = constants;
    const XML = `<?xml version="1.0" encoding="UTF-8"?>
        <node>Bonjour ${delimiters.start}#if employee.gender${delimiters.end}Mr${delimiters.start}#else${delimiters.end}Ms.${delimiters.start}#endif${delimiters.end} ${delimiters.start}employee.fullName | format${delimiters.end},</node>`;
    const dom = new DOMParser().parseFromString(XML, 'text/xml');
    const parser = new TagParser(dom);
    const ast = parser.parse();
    expect(ast).toHaveProperty('length', 2);
})