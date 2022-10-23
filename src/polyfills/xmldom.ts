import {g, isNode} from './polyfillsUtils';

const origin = isNode ? require('@xmldom/xmldom') : g;

export const DOMImplementation = origin.DOMImplementation;
export const DOMParser = origin.DOMParser;
export const XMLSerializer = origin.XMLSerializer;
