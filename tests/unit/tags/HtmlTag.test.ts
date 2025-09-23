import { faker } from '@faker-js/faker';
import YumTemplate from '../../../src/YumTemplate';
import { hasTagsRegExp } from '../../../src/tags/tagUtils';
import HtmlTag from '../../../src/tags/HtmlTag';

YumTemplate.registerTag(HtmlTag.statement, HtmlTag);

const INPUT_DIR = './tests/templates/';
const OUTPUT_DIR = './temp/';
const DATA = {
    html: `<h1>${faker.lorem.words(4)}</h1><p>${faker.lorem.words(25)}.</p>`,
};

xdescribe('Html tag - ok', () => {
    const TEST = 'html-tag-ok';
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

    xtest('PowerPoint File', async () => {
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
