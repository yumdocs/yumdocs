import {faker} from '@faker-js/faker';
import {pad, format} from '../../../src/tags/expressionUtils';

test('pad', () => {
    const i1 = faker.datatype.number({min: 0, max: 9});
    expect(pad(i1)).toEqual('0' + i1)
    const i2 = faker.datatype.number({min: 10, max: 99});
    expect(pad(i2)).toEqual('' + i2)
});

test('format', () => {
    // culture?
    expect(format('a{0:n}b{1:n}c{2:n}', 1, 2, 3)).toEqual('a1.00b2.00c3.00');
});