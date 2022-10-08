import constants from '../constants';

/**
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
 */
export function sanitizeWordMarkupInExpressions (xml: string) {
    const rx_find = /{(<\/w:t><\/w:r><w:r\s?[^>]*><w:t>)?{[^{}]+}(<\/w:t><\/w:r><w:r\s?[^>]*><w:t>)?}/;
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
