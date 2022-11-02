import YumTemplate from "../../src/YumTemplate";
import errorCodes from "../../src/error/errorCodes";
import YumError from "../../src/error/YumError";

const INPUT_DIR = './tests/templates/';
// const OUTPUT_DIR = './temp/'

describe('Missing file', () => {
    test('Missing input template', async () => {
        const DOCX = 'input-missing.docx'; // This file does not exist
        const file = new YumTemplate();
        try {
            await file.load(`${INPUT_DIR}${DOCX}`);
            expect(true).toBe(false); // file.load should throw
        } catch (e) {
            expect(e).toBeInstanceOf(YumError);
            expect(e).toMatchObject(errorCodes.get(1011) || {});
            // expect((<YumError>e).originalError).toBeInstanceOf(Error);
        }
    });
});

describe('Corrupt file', () => {
    test('Text File', async () => {
        const TXT = 'input-corrupt.txt';
        const file = new YumTemplate();
        try {
            await file.load(`${INPUT_DIR}${TXT}`);
            expect(true).toBe(false); // file.load should throw
        } catch (e) {
            expect(e).toBeInstanceOf(YumError);
            expect(e).toMatchObject(errorCodes.get(1012) || {});
            expect((<YumError>e).originalError).toBeInstanceOf(Error);
        }
    });

    test('Odt File', async () => {
        const ODT = 'input-corrupt.odt';
        const file = new YumTemplate();
        try {
            await file.load(`${INPUT_DIR}${ODT}`);
            await file.render({dummy: true});
            expect(true).toBe(false); // file.load should throw
        } catch (e) {
            expect(e).toBeInstanceOf(YumError);
            expect(e).toMatchObject(errorCodes.get(1020) || {});
            expect((<YumError>e).originalError).toBeInstanceOf(Error);
        }
    });

    test('Zip File', async () => {
        const ZIP = 'input-corrupt.zip';
        const file = new YumTemplate();
        try {
            await file.load(`${INPUT_DIR}${ZIP}`);
            await file.render({dummy: true});
            expect(true).toBe(false); // file.load should throw
        } catch (e) {
            expect(e).toBeInstanceOf(YumError);
            expect(e).toMatchObject(errorCodes.get(1020) || {});
            expect((<YumError>e).originalError).toBeInstanceOf(Error);
        }
    });
});