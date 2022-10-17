import EachTag from "./EachTag";
import ExpressionTag from "./ExpressionTag";
import IfTag from "./IfTag";
import ITagConstructor from "./ITagConstructor";

/**
 * tagMap
 * Note: avoids circular references with OpenXMLTemplate
 */
// const tagMap = new Map<string, typeof AbstractTag>([
const tagMap = new Map<string, ITagConstructor>([
    [ExpressionTag.tag, ExpressionTag],
    [EachTag.tag, EachTag],
    [IfTag.tag, IfTag]
]);

/**
 * Default export
 */
export default tagMap;