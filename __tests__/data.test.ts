import { faker } from '@faker-js/faker';
import constants from '../src/constants';
import OpenXMLTemplate from '../src/OpenXMLTemplate';

const INPUT_DIR = './__tests__/';
const OUTPUT_DIR = './temp/'
const TEST = 'data';
const DOCX = `${TEST}.docx`;
const PPTX = `${TEST}.pptx`;
const XLSX = `${TEST}.xlsx`;
const DATA = {
    text: faker.datatype.string(),
    integer: faker.datatype.number(),
    float: faker.datatype.float(),
    boolean: faker.datatype.boolean(),
    date: faker.datatype.datetime()
};

test('Word File', async () => {
    const file = new OpenXMLTemplate();
    await file.load(`${INPUT_DIR}${DOCX}`);
    const ret = await file.render(DATA);
    await file.saveAs(`${OUTPUT_DIR}${DOCX}`);
    expect(ret).not.toMatch(constants.matchExpression);
});

xtest('PowerPoint File', async () => {
    const file = new OpenXMLTemplate();
    await file.load(`${INPUT_DIR}${PPTX}`);
    const ret = await file.render(DATA);
    await file.saveAs(`${OUTPUT_DIR}${PPTX}`);
    expect(ret).not.toMatch(constants.matchExpression);
});

xtest('Excel File', async () => {
    const file = new OpenXMLTemplate();
    await file.load(`${INPUT_DIR}${XLSX}`);
    const ret = await file.render(DATA);
    await file.saveAs(`${OUTPUT_DIR}${XLSX}`);
    expect(ret).not.toMatch(constants.matchExpression);
});