import cultureMap from "./cultureMap";

/**
 * getCulture
 * @param locale
 */
export function getCulture(locale= 'en-US'): Record<string, unknown> | undefined {
    return cultureMap.get(locale);
}