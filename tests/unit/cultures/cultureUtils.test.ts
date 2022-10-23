// import {faker} from '@faker-js/faker';
import constants from '../../../src/constants';
import { getCulture } from '../../../src/cultures/cultureUtils';

test('getCulture', () => {
    expect(getCulture(constants.locale)).toMatchObject({name: constants.locale})
});