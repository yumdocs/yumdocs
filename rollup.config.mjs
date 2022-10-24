// rollup.config.mjs
// see https://github.com/rollup/rollup-starter-lib/blob/typescript/rollup.config.js
import typescript from '@rollup/plugin-typescript';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from './package.json' assert { type: "json" };

export default [
    // Browser friendly UMD build
    {
        input: 'src/OpenXMLTemplate.ts',
        output: {
            format: 'umd',
            file: pkg.browser,
            name: pkg.name,
        },
        plugins: [
            commonjs(),
            nodeResolve({
                resolveOnly: [/* '@xmldom/xmldom', */ 'file-saver', 'jexl', 'jszip']
            }),
            typescript(),
        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    {
        input: 'src/OpenXMLTemplate.ts',
        external: pkg.bundledDependencies,
        plugins: [
            typescript()
        ],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'esm' }
        ]
    }
];