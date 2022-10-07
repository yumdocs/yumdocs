import * as fs from 'fs';
import * as path from 'path';
import Benchmark from 'benchmark';
import JSZip from 'jszip'; // JSZip 3
import PizZip from 'pizzip'; // JSZip 2
// TODO import * as zip from "@zip.js/zip.js";
// TODO adm-zip, pako, fflate, yazl/yauzl


const suite = new Benchmark.Suite;

// add tests
suite
    .add('JSZip', { defer: true, fn: function(deferred: { resolve: any, reject: any }) {
            fs.promises.readFile(path.resolve(__dirname, '../__tests__/data.docx'))
                .then((handle) => {
                    JSZip.loadAsync(handle)
                        .then((zip) => {
                            zip.generateAsync({
                                type: 'nodebuffer',
                                streamFiles: true,
                                // compression: 'DEFLATE'
                            })
                                .then((buf) => {
                                    fs.promises.writeFile(path.resolve(__dirname, '../temp/_jszip.docx'), buf)
                                        .then(() => { deferred.resolve(); })
                                        .catch(deferred.reject);
                                })
                                .catch(deferred.reject);
                        })
                        .catch(deferred.reject);
                })
                .catch(deferred.reject);
        }})
    .add('Pizzip', function() {
        // Load the docx file as binary content
        const content = fs.readFileSync(
            path.resolve(__dirname, '../__tests__/data.docx'),
            "binary"
        );
        const zip = new PizZip(content);
        // Docxtemplater code is here
        const buf = zip.generate({
            type: "nodebuffer",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
        });
        // buf is a nodejs Buffer, you can either write it to a
        // file or res.send it with express for example.
        fs.writeFileSync(path.resolve(__dirname, "../temp/_pizzip.docx"), buf);
    })
    // add listeners
    .on('cycle', function(event: { target: any; }) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        // @ts-ignore
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({ 'async': true });