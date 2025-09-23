import { YumTemplate } from '../../src/index';
import constants from '../../src/constants';

describe('YumTemplate Constructor and Options', () => {
    describe('constructor', () => {
        test('should create instance with default options', () => {
            const template = new YumTemplate();
            expect(template).toBeInstanceOf(YumTemplate);
        });

        test('should create instance with empty options object', () => {
            const template = new YumTemplate({});
            expect(template).toBeInstanceOf(YumTemplate);
        });
    });

    describe('delimiter options', () => {
        test('should use default delimiters when none provided', () => {
            const template = new YumTemplate();
            // Access private options through reflection to test sanitization
            const options = (template as any)._options;
            expect(options.delimiters.start).toBe(constants.delimiters.start);
            expect(options.delimiters.end).toBe(constants.delimiters.end);
        });

        test('should use default delimiters when empty delimiters object provided', () => {
            const template = new YumTemplate({ delimiters: {} });
            const options = (template as any)._options;
            expect(options.delimiters.start).toBe(constants.delimiters.start);
            expect(options.delimiters.end).toBe(constants.delimiters.end);
        });

        test('should use custom start delimiter and default end delimiter', () => {
            const customStart = '<%';
            const template = new YumTemplate({
                delimiters: { start: customStart },
            });
            const options = (template as any)._options;
            expect(options.delimiters.start).toBe(customStart);
            expect(options.delimiters.end).toBe(constants.delimiters.end);
        });

        test('should use default start delimiter and custom end delimiter', () => {
            const customEnd = '%>';
            const template = new YumTemplate({
                delimiters: { end: customEnd },
            });
            const options = (template as any)._options;
            expect(options.delimiters.start).toBe(constants.delimiters.start);
            expect(options.delimiters.end).toBe(customEnd);
        });

        test('should use both custom start and end delimiters', () => {
            const customStart = '<%';
            const customEnd = '%>';
            const template = new YumTemplate({
                delimiters: { start: customStart, end: customEnd },
            });
            const options = (template as any)._options;
            expect(options.delimiters.start).toBe(customStart);
            expect(options.delimiters.end).toBe(customEnd);
        });

        test('should handle undefined start delimiter', () => {
            const template = new YumTemplate({
                delimiters: { start: undefined, end: '%>' },
            });
            const options = (template as any)._options;
            expect(options.delimiters.start).toBe(constants.delimiters.start);
            expect(options.delimiters.end).toBe('%>');
        });

        test('should handle undefined end delimiter', () => {
            const template = new YumTemplate({
                delimiters: { start: '<%', end: undefined },
            });
            const options = (template as any)._options;
            expect(options.delimiters.start).toBe('<%');
            expect(options.delimiters.end).toBe(constants.delimiters.end);
        });

        test('should handle empty string delimiters', () => {
            const template = new YumTemplate({
                delimiters: { start: '', end: '' },
            });
            const options = (template as any)._options;
            expect(options.delimiters.start).toBe(constants.delimiters.start);
            expect(options.delimiters.end).toBe(constants.delimiters.end);
        });
    });

    describe('locale options', () => {
        test('should use default locale when none provided', () => {
            const template = new YumTemplate();
            const options = (template as any)._options;
            expect(options.locale).toBe(constants.locale);
        });

        test('should use custom locale when provided', () => {
            const customLocale = 'fr-FR';
            const template = new YumTemplate({ locale: customLocale });
            const options = (template as any)._options;
            expect(options.locale).toBe(customLocale);
        });

        test('should use default locale when empty string provided', () => {
            const template = new YumTemplate({ locale: '' });
            const options = (template as any)._options;
            expect(options.locale).toBe(constants.locale);
        });

        test('should use default locale when undefined provided', () => {
            const template = new YumTemplate({ locale: undefined });
            const options = (template as any)._options;
            expect(options.locale).toBe(constants.locale);
        });
    });

    describe('combined options', () => {
        test('should handle both custom delimiters and locale', () => {
            const customStart = '[%';
            const customEnd = '%]';
            const customLocale = 'de-DE';

            const template = new YumTemplate({
                delimiters: { start: customStart, end: customEnd },
                locale: customLocale,
            });

            const options = (template as any)._options;
            expect(options.delimiters.start).toBe(customStart);
            expect(options.delimiters.end).toBe(customEnd);
            expect(options.locale).toBe(customLocale);
        });

        test('should handle partial delimiters with custom locale', () => {
            const customStart = '{%';
            const customLocale = 'es-ES';

            const template = new YumTemplate({
                delimiters: { start: customStart },
                locale: customLocale,
            });

            const options = (template as any)._options;
            expect(options.delimiters.start).toBe(customStart);
            expect(options.delimiters.end).toBe(constants.delimiters.end);
            expect(options.locale).toBe(customLocale);
        });
    });

    describe('regression tests', () => {
        test('end delimiter should not use start delimiter value (bug fix)', () => {
            const customStart = '<%';
            const customEnd = '%>';

            const template = new YumTemplate({
                delimiters: { start: customStart, end: customEnd },
            });

            const options = (template as any)._options;
            // This test ensures the bug where end used start value is fixed
            expect(options.delimiters.end).toBe(customEnd);
            expect(options.delimiters.end).not.toBe(customStart);
            expect(options.delimiters.start).toBe(customStart);
        });

        test('end delimiter should be independent of start delimiter', () => {
            const customStart = '[[';

            const template = new YumTemplate({
                delimiters: { start: customStart },
            });

            const options = (template as any)._options;
            // Ensure end delimiter uses default, not the custom start value
            expect(options.delimiters.end).toBe(constants.delimiters.end);
            expect(options.delimiters.end).not.toBe(customStart);
            expect(options.delimiters.start).toBe(customStart);
        });
    });
});
