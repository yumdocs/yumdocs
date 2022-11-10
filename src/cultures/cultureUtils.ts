import ICulture from "./ICulture";
import constants from '../constants';
import cultureMap from './cultureMap';

/**
 * getCulture
 * @param locale
 */
export function getCulture(locale= constants.locale): ICulture | undefined {
    return cultureMap.get(locale);
}