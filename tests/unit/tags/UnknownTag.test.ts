import { faker } from '@faker-js/faker';
import YumTemplate from '../../../src/YumTemplate';
// import {hasTagsRegExp} from "../../../src/tags/tagUtils";
import YumError from "../../../src/error/YumError";
import errorCodes from "../../../src/error/errorCodes";

const INPUT_DIR = './tests/templates/';
// const OUTPUT_DIR = './temp/'
const DATA = {
    text: faker.random.word()
};

describe('Unknown or misspelled statement', () => {
    const TEST = 'unknown-tag';
    const DOCX = `${TEST}.docx`;
    const PPTX = `${TEST}.pptx`;
    const XLSX = `${TEST}.xlsx`;

    test('Word File', async () => {
        try {
            const file = new YumTemplate();
            await file.load(`${INPUT_DIR}${DOCX}`);
            await file.render(DATA);
            expect(true).toBe(false); // file.render should throw
        } catch (e) {
            expect(e).toBeInstanceOf(YumError);
            expect(e).toMatchObject(errorCodes.get(1014) || {});
            // expect((<YumError>e).originalError).toBeInstanceOf(Error);
        }
    });

    xtest('PowerPoint File', async () => {
        try {
            const file = new YumTemplate();
            await file.load(`${INPUT_DIR}${PPTX}`);
            await file.render(DATA);
            expect(true).toBe(false); // file.render should throw
        } catch (e) {
            expect(e).toBeInstanceOf(YumError);
            expect(e).toMatchObject(errorCodes.get(1014) || {});
            // expect((<YumError>e).originalError).toBeInstanceOf(Error);
        }
    });

    xtest('Excel File', async () => {
        try {
            const file = new YumTemplate();
            await file.load(`${INPUT_DIR}${XLSX}`);
            await file.render(DATA);
            expect(true).toBe(false); // file.render should throw
        } catch (e) {
            expect(e).toBeInstanceOf(YumError);
            expect(e).toMatchObject(errorCodes.get(1014) || {});
            // expect((<YumError>e).originalError).toBeInstanceOf(Error);
        }
    });
});
