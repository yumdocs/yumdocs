import {faker} from '@faker-js/faker';
import {getCulture, pad} from '../../src/tokens/tokenUtils';

test('getCulture', () => {
    expect(getCulture('en-US')).toMatchObject({name: 'en-US'})
});

test('pad', () => {
    const i1 = faker.datatype.number({min: 0, max: 9});
    expect(pad(i1)).toEqual('0' + i1)
    const i2 = faker.datatype.number({min: 10, max: 99});
    expect(pad(i2)).toEqual('' + i2)
});