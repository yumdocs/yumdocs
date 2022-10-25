# Yumdocs

> Yumdocs is a template engine for Office documents, including Word, PowerPoint and Excel, in JavaScript environments.
> It merges documents with data, executing statements and expressions found in tags.

## Documentation

Yumdocs is fully documented at https://dev.yumdocs.com.

## License and Copyright

This project is MIT Licensed like its 3rd party components:

- [@xmldom/xmldom](https://github.com/xmldom/xmldom/blob/master/LICENSE)
- [file-saver](https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md)
- [jexl](https://github.com/TomFrost/Jexl/blob/master/LICENSE.txt)
- [jszip](https://github.com/Stuk/jszip/blob/main/LICENSE.markdown)

Copyright (c) 2022 - Jacques L. Chereau. All rights reserved.

## Quick Start

Check https://dev.yumdocs.com for browser instructions.

### Prerequisites

Download and install nodeJS v16+ from https://nodejs.org/.

### Installation

Create a project directory and run:

```shell
npm init -y
npm i @yumdocs/yumdocs
```

### Getting started

1) Create a Word document named `input.docx`, type `{{dummy}}` and save it in the project directory.

2) Create a file named `index.mjs` and copy paste:

```js
import OpenXMLTemplate from '@yumdocs/yumdocs';
const t = new OpenXMLTemplate();
await t.load('./input.docx');
await t.render({dummy: 'Anything you see fit'});
await t.saveAs('./output.docx');
```

3) `output.docx` has been generated and the `{{dummy}}` placeholder has been replaced with `Anything you see fit`.