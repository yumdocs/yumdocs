import cultureMap from '../../../src/cultures/cultureMap';
import { getCulture } from '../../../src/cultures/cultureUtils';

describe('cultureMap', () => {
    test('all', () => {
        for (const locale of cultureMap.keys()) {
            expect(getCulture(locale)).toMatchObject({name: locale})
        }
    });
});