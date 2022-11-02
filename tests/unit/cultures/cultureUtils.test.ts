import {faker} from '@faker-js/faker';
import constants from '../../../src/constants';
import { getCulture } from '../../../src/cultures/cultureUtils';

describe('getCulture', () => {
    test('en-US', () => {
        expect(getCulture(constants.locale)).toMatchObject({name: constants.locale});
    });
    test('undefined, en-US by default', () => {
        expect(getCulture()).toMatchObject({name: constants.locale});
    });
    test('random', () => {
        expect(getCulture(faker.random.word())).toBeUndefined();
    });
});