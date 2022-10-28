import arEG from "./ar-EG";
import bnIN from "./bn-IN";
import deDE from "./de-DE";
import enGB from "./en-GB";
import enUS from "./en-US";
import esES from "./es-ES";
import frFR from "./fr-FR";
import hiIN from "./hi-IN";
import itIT from "./it-IT";
import jaJP from "./ja-JP";
import ptPT from "./pt-PT";
import ruRU from "./ru-RU";
import zhCN from "./zh-CN";

/**
 * cultureMap
 * Note: avoids circular references with YumTemplate
 */
const cultureMap = new Map<string, Record<string, unknown>>([
    ['ar-EG', arEG],
    ['bn-IN', bnIN],
    ['de-DE', deDE],
    ['en-GB', enGB],
    ['en-US', enUS],
    ['es-ES', esES],
    ['fr-FR', frFR],
    ['hi-IN', hiIN],
    ['it-IT', itIT],
    ['ja-JP', jaJP],
    ['pt-PT', ptPT],
    ['ru-RU', ruRU],
    ['zh-CN', zhCN],
]);

/**
 * Default export
 */
export default cultureMap;