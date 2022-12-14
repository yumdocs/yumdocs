import {escapeRegExp} from "../tags/tagUtils";

/**
 * sanitizePptMarkup
 *
 *
 * @param xml
 * @param delimiters
 */
export function sanitizePptMarkup (xml: string, delimiters: { start: string, end: string }) {
    const { start, end } = delimiters;
    const garbage = '<\\/a:t><\\/a:r><a:r\\s?[^>]*><a:t\\s?[^>]*>';
    let str = '';
    for (let i = 0; i < start.length - 1; i++) {
        str += `${escapeRegExp(start.charAt(i))}(${garbage})?`;
    }
    str += `${start.slice(-1)}[^${escapeRegExp(end.charAt(0))}]+${end.slice(0, 1)}`;
    for (let i = 1; i < start.length; i++) {
        str += `(${garbage})?${escapeRegExp(end.charAt(i))}`;
    }
    // const rx_find = /{(<\/a:t><\/a:r><a:r\s?[^>]*><a:t\s?[^>]*>)?{[^{}]+}(<\/a:t><\/a:r><a:r\s?[^>]*><a:t\s?[^>]*>)?}/;
    const rx_find = new RegExp(str);
    const rx_replace = /<\/?a:[^>]+>/g;
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
