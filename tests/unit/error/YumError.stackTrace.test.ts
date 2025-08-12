import YumError from '../../../src/error/YumError';

describe('YumError Stack Trace Improvements', () => {
    it('should provide enhanced stack trace with original error', () => {
        const originalError = new Error('Original error message');
        const yumError = new YumError(1000, { error: originalError });
        
        const stackTrace = yumError.stackTrace;
        expect(stackTrace).toContain('YumError');
        expect(stackTrace).toContain('Caused by:');
        expect(stackTrace).toContain('Original error message');
    });

    it('should provide stack trace even without original error', () => {
        const yumError = new YumError(1000);
        
        const stackTrace = yumError.stackTrace;
        expect(stackTrace).toBeTruthy();
        expect(stackTrace).not.toContain('Caused by:');
    });

    it('should capture stack trace properly', () => {
        const yumError = new YumError(1000);
        
        expect(yumError.stack).toBeTruthy();
        expect(yumError.name).toBe('YumError');
    });
});