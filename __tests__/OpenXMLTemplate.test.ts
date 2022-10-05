import { faker } from '@faker-js/faker';
import constants from '../src/constants';
import OpenXMLTemplate from '../src/OpenXMLTemplate';

const DOCX = './__tests__/test1.docx';
const PPTX = './__tests__/test1.pptx';
const XLSX = './__tests__/test1.xlsx';
const DATA = {
    dummy: faker.random.word(),
    people: [
        faker.name.fullName(),
        faker.name.fullName(),
        faker.name.fullName(),
    ],
};

test('Word File', async () => {
    const file = new OpenXMLTemplate('docx');
    await file.load(DOCX);
    const ret = await file.render(DATA);
    expect(ret).not.toMatch(constants.matchExpression);
    await file.saveAs('./temp/test1.docx');
});

test('PowerPoint File', async () => {
    const file = new OpenXMLTemplate('pptx');
    await file.load(PPTX);
    const ret = await file.render(DATA);
    expect(ret).not.toMatch(constants.matchExpression);
    await file.saveAs('./temp/test1.pptx');
});

test('Excel File', async () => {
    const file = new OpenXMLTemplate('xlsx');
    await file.load(XLSX);
    const ret = await file.render(DATA);
    expect(ret).not.toMatch(constants.matchExpression);
    await file.saveAs('./temp/test1.xlsx');
});
