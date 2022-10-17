import IPartConstructor from "../parts/IPartConstructor";
import TemplatedPart from "../parts/TemplatedPart";

/**
 * partMap
 * Note: avoids circular references with OpenXMLTemplate
 */
// const partMap = new Map<string, typeof AbstractPart>([
const partMap = new Map<string, IPartConstructor>([
    // Word
    ['word/document.xml', TemplatedPart],
    // Powerpoint
    ['ppt/slides/slide.xml', TemplatedPart],
    // Excel
    ['xl/sharedStrings.xml', TemplatedPart]
]);

/**
 * Default export
 */
export default partMap;