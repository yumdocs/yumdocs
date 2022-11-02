import { faker } from '@faker-js/faker';
import YumTemplate from '../../../src/YumTemplate';
import {hasTagsRegExp} from "../../../src/tags/tagUtils";

const INPUT_DIR = './tests/templates/';
const OUTPUT_DIR = './temp/'
const DATA = {
    persons: [
        { name: faker.name.fullName() },
        { name: faker.name.fullName() },
        { name: faker.name.fullName() },
        { name: faker.name.fullName() },
    ]
};
describe('Each tag - ok', () => {
    const TEST = 'each-tag-ok';
    const DOCX = `${TEST}.docx`;
    const PPTX = `${TEST}.pptx`;
    const XLSX = `${TEST}.xlsx`;

    test('Word File', async () => {
        const file = new YumTemplate();
        await file.load(`${INPUT_DIR}${DOCX}`);
        const ret = await file.render(DATA);
        await file.saveAs(`${OUTPUT_DIR}${DOCX}`);
        expect(ret).not.toMatch(hasTagsRegExp());
    });

    test('PowerPoint File', async () => {
        const file = new YumTemplate();
        await file.load(`${INPUT_DIR}${PPTX}`);
        const ret = await file.render(DATA);
        await file.saveAs(`${OUTPUT_DIR}${PPTX}`);
        expect(ret).not.toMatch(hasTagsRegExp());
    });

    xtest('Excel File', async () => {
        const file = new YumTemplate();
        await file.load(`${INPUT_DIR}${XLSX}`);
        const ret = await file.render(DATA);
        await file.saveAs(`${OUTPUT_DIR}${XLSX}`);
        expect(ret).not.toMatch(hasTagsRegExp());
    });
});

xdescribe('Each tag - nested', () => {
    // TODO
});