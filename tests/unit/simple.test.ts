import { faker } from '@faker-js/faker';
import OpenXMLTemplate from '../../src/OpenXMLTemplate';
import {hasTagsRegExp} from "../../src/tags/tagUtils";

const INPUT_DIR = './tests/templates/';
const OUTPUT_DIR = './temp/'
const TEST = 'simple';
const DOCX = `${TEST}.docx`;
const PPTX = `${TEST}.pptx`;
const XLSX = `${TEST}.xlsx`;
const DATA = {
    dummy: faker.random.word()
};

test('Word File', async () => {
    const file = new OpenXMLTemplate();
    await file.load(`${INPUT_DIR}${DOCX}`);
    const ret = await file.render(DATA);
    await file.saveAs(`${OUTPUT_DIR}${DOCX}`);
    expect(ret).not.toMatch(hasTagsRegExp());
});

test('PowerPoint File', async () => {
    const file = new OpenXMLTemplate();
    await file.load(`${INPUT_DIR}${PPTX}`);
    const ret = await file.render(DATA);
    await file.saveAs(`${OUTPUT_DIR}${PPTX}`);
    expect(ret).not.toMatch(hasTagsRegExp());
});

test('Excel File', async () => {
    const file = new OpenXMLTemplate();
    await file.load(`${INPUT_DIR}${XLSX}`);
    const ret = await file.render(DATA);
    await file.saveAs(`${OUTPUT_DIR}${XLSX}`);
    expect(ret).not.toMatch(hasTagsRegExp());
});