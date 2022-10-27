import enGB from "./en-GB";
import enUS from "./en-US";
import frFR from "./fr-FR";

/**
 * cultureMap
 * Note: avoids circular references with YumTemplate
 */
const cultureMap = new Map<string, Record<string, unknown>>([
    ['en-GB', enGB],
    ['en-US', enUS],
    ['fr-FR', frFR]
]);

/**
 * Default export
 */
export default cultureMap;