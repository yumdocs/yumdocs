import { faker } from '@faker-js/faker';
import constants from '../src/constants';
import OpenXMLTemplate from '../src/OpenXMLTemplate';

const INPUT_DIR = './__tests__/';
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
    expect(ret).not.toMatch(constants.matchExpression);
    await file.saveAs(`${OUTPUT_DIR}${DOCX}`);
});

test('PowerPoint File', async () => {
    const file = new OpenXMLTemplate();
    await file.load(`${INPUT_DIR}${PPTX}`);
    const ret = await file.render(DATA);
    expect(ret).not.toMatch(constants.matchExpression);
    await file.saveAs(`${OUTPUT_DIR}${PPTX}`);
});

test('Excel File', async () => {
    const file = new OpenXMLTemplate();
    await file.load(`${INPUT_DIR}${XLSX}`);
    const ret = await file.render(DATA);
    expect(ret).not.toMatch(constants.matchExpression);
    await file.saveAs(`${OUTPUT_DIR}${DOCX}`);
});