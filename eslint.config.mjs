import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
    // Global ignores
    {
        ignores: [
            'dist/**/*',
            'coverage/**/*',
            'node_modules/**/*',
            '*.d.ts',
            '**/*.min.js',
        ],
    },

    // Base configuration for all JS/TS files
    {
        files: ['src/**/*.{js,ts}', 'tests/**/*.{js,ts}'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',

                // Node.js globals
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',

                // ES2022 globals
                globalThis: 'readonly',

                // Jest globals
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                jest: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            ...prettierConfig.rules,
            // Allow unused vars in some cases for legacy compatibility
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            // Allow require imports in polyfills
            '@typescript-eslint/no-require-imports': 'off',
            // Allow any type in tests
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // Source files specific rules
    {
        files: ['src/**/*.{js,ts}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },

    // Test files specific rules
    {
        files: ['tests/**/*.{js,ts}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
