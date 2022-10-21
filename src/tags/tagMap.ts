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
    [ExpressionTag.statement, ExpressionTag],
    [EachTag.statement, EachTag],
    [IfTag.statement, IfTag]
]);

/**
 * Default export
 */
export default tagMap;