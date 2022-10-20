import {hasTagsRegExp} from "../../src/tags/tagUtils";

test('hasTagRegExp', () => {
    const rx = hasTagsRegExp();
    // TODO can do better
    expect(rx).toBeInstanceOf(RegExp);
});