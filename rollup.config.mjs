// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/OpenXMLTemplate.ts',
    output: {
        format: 'cjs',
        file: 'dist/index.js'
    },
    plugins: [typescript()]
};