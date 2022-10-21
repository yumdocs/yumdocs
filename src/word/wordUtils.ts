import {escapeRegExp} from "../tags/tagUtils";

/**
 * sanitizeWordMarkup
 *
 * Versioning in Word is tracked with rsidR sections, like:
 * {</w:t></w:r><w:r w:rsidR="00245996"><w:t>{</w:t></w:r><w:r><w:t>te</w:t></w:r><w:r w:rsidR="00130070"><w:t>x</w:t></w:r><w:r w:rsidR="00EE726C"><w:t>t</w:t></w:r><w:r w:rsidR="00060B35"><w:t>}</w:t></w:r><w:r><w:t>}
 * {{te</w:t></w:r><w:r w:rsidR="00130070"><w:t>x</w:t></w:r><w:r w:rsidR="00EE726C"><w:t>t</w:t></w:r><w:r w:rsidR="00F00E75"><w:t>}</w:t></w:r><w:r><w:t>}
 * {{</w:t></w:r><w:r w:rsidR="00BD72CA"><w:t>integer</w:t></w:r><w:r><w:t>}}
 * {{</w:t></w:r><w:r w:rsidR="00BD72CA"><w:t>b</w:t></w:r><w:r><w:t>oolean}}
 *
 * Proof errors are also marked:
 * {{<w:proofErr w:type="spellStart"/>boolean<w:proofErr w:type="spellEnd"/>}}
 *
 * @param xml
 * @param delimiters
 */
export function sanitizeWordMarkup (xml: string, delimiters: { start: string, end: string }) {
    const { start, end } = delimiters;
    const garbage = '<\\/w:t><\\/w:r><w:r\\s?[^>]*><w:t\\s?[^>]*>';
    let str = '';
    for (let i = 0; i < start.length - 1; i++) {
        str += `${escapeRegExp(start.charAt(i))}(${garbage})?`;
    }
    str += `${start.slice(-1)}[^${escapeRegExp(end.charAt(0))}]+${end.slice(0, 1)}`;
    for (let i = 1; i < start.length; i++) {
        str += `(${garbage})?${escapeRegExp(end.charAt(i))}`;
    }
    // const rx_find = /{(<\/w:t><\/w:r><w:r\s?[^>]*><w:t\s?[^>]*>)?{[^{}]+}(<\/w:t><\/w:r><w:r\s?[^>]*><w:t\s?[^>]*>)?}/;
    const rx_find = new RegExp(str);
    const rx_replace = /<\/?w:[^>]+>/g;
    let pos1 = 0, pos2 = 0, ret = '';
    while (xml.length > 0) {
        // Search for an expression in xml
        pos1 = xml.search(rx_find);
        if (pos1 > -1) {
            // find the end of the expression
            pos2 = xml.indexOf('}', pos1 + 1);
            pos2 = xml.indexOf('}', pos2 + 1);
            ret += xml.substring(0, pos1);
            ret += xml.substring(pos1, pos2 + '}'.length).replace(rx_replace, '');
            xml = xml.substring(pos2 + '}'.length)
        } else {
            ret += xml;
            xml = '';
        }
    }
    return ret;
}
