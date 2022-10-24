import {g, isNodeJS} from './polyfillsUtils';

const origin = isNodeJS ? require('@xmldom/xmldom') : g;

export const DOMImplementation = origin.DOMImplementation;
export const DOMParser = origin.DOMParser;
export const XMLSerializer = origin.XMLSerializer;
