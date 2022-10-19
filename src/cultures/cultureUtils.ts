import constants from '../constants';
import cultureMap from './cultureMap';

/**
 * getCulture
 * @param locale
 */
export function getCulture(locale= constants.locale): Record<string, unknown> | undefined {
    return cultureMap.get(locale);
}