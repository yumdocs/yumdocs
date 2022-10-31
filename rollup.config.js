// rollup.config.js
// see https://github.com/rollup/rollup-starter-lib/blob/typescript/rollup.config.js
const typescript = require('@rollup/plugin-typescript');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const nodePolyfills =require('rollup-plugin-polyfill-node');
// (node:1669) ExperimentalWarning: Importing JSON modules is an experimental feature.
// import pkg from './package.json' assert { type: "json" };
const pkg = require('./package.json');
const globals = {
    'safe-buffer': 'buffer',
    'lie': 'lie'
}
module.exports = [
    // Browser friendly UMD build
    {
        input: 'src/index.ts',
        output: {
            format: 'umd',
            file: pkg.browser,
            name: pkg.name,
            globals
        },
        plugins: [
            commonjs(),
            nodeResolve({
                resolveOnly: [/* '@xmldom/xmldom', */ 'file-saver', 'jexl', 'jszip']
            }),
            nodePolyfills(),
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
        input: 'src/index.ts',
        external: pkg.bundledDependencies,
        plugins: [
            typescript()
        ],
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                globals
            },
            {
                file: pkg.module,
                format: 'esm',
                globals
            }
        ]
    }
];