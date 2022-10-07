import * as fs from 'fs';
import * as path from 'path';
import Benchmark from 'benchmark';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import {faker} from "@faker-js/faker";
import OpenXMLTemplate from "../src/OpenXMLTemplate";

const suite = new Benchmark.Suite;
const DATA = {
    text: faker.datatype.string(),
    integer: faker.datatype.number(),
    float: faker.datatype.float(),
    boolean: faker.datatype.boolean(),
    date: faker.datatype.datetime()
};

// add tests
suite
    .add('ooxml', { defer: true, fn: function(deferred: { resolve: any, reject: any }) {
        const file = new OpenXMLTemplate();
        file.load(path.resolve(__dirname, '../__tests__/data.docx'))
            .then(() => {
                file.render(DATA)
                    .then(() => {
                        file.saveAs(path.resolve(__dirname, '../temp/_ooxml.docx'))
                            .then(() => { deferred.resolve(); })
                            .catch(deferred.reject);
                    })
                    .catch(deferred.reject);
            })
            .catch(deferred.reject)
    }})
    .add('docxtemplater', function() {
        // Load the docx file as binary content
        const content = fs.readFileSync(
            path.resolve(__dirname, "./docxtemplater.docx"),
            "binary"
        );
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
        doc.render(DATA);
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
        });
        // buf is a nodejs Buffer, you can either write it to a
        // file or res.send it with express for example.
        fs.writeFileSync(path.resolve(__dirname, "../temp/_docxtemplater.docx"), buf);
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