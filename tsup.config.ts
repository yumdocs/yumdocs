import { defineConfig } from 'tsup'

export default defineConfig([
  // CommonJS and ESM builds for Node.js and modern bundlers
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: false,
    external: ['@xmldom/xmldom', 'file-saver', 'jexl', 'jszip'],
    platform: 'node',
    outDir: 'dist',
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.cjs.js' : '.esm.js'
      }
    }
  },
  // IIFE build for browsers (equivalent to UMD)
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    dts: false,
    clean: false,
    sourcemap: false,
    minify: false,
    globalName: 'YumDocs',
    platform: 'browser',
    outDir: 'dist',
    outExtension() {
      return {
        js: '.umd.js'
      }
    },
    // Bundle everything for browser use
    noExternal: ['@xmldom/xmldom', 'file-saver', 'jexl', 'jszip'],
    esbuildOptions(options) {
      // Alias Node.js modules to browser polyfills
      options.alias = {
        fs: './src/polyfills/fs.ts'
      }
    }
  }
])