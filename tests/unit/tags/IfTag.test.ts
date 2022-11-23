import { faker } from '@faker-js/faker';
import YumTemplate from '../../../src/YumTemplate';
import {hasTagsRegExp} from "../../../src/tags/tagUtils";

const INPUT_DIR = './tests/templates/';
const OUTPUT_DIR = './temp/'
const DATA = {
    hasText: faker.datatype.boolean(),
    text: faker.random.word()
};

describe('If tag - ok', () => {
    const TEST = 'if-tag-ok';
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

describe('If tag - one line', () => {
    const TEST = 'if-tag-oneline-ok';
    const DOCX = `${TEST}.docx`;
    // const PPTX = `${TEST}.pptx`;
    // const XLSX = `${TEST}.xlsx`;

    test('Word File', async () => {
        const file = new YumTemplate();
        await file.load(`${INPUT_DIR}${DOCX}`);
        const ret = await file.render(DATA);
        await file.saveAs(`${OUTPUT_DIR}${DOCX}`);
        expect(ret).not.toMatch(hasTagsRegExp());
    });
});

xdescribe('If tag - nested', () => {
    // TODO
});