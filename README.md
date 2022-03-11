# Tablab <!-- omit in toc -->

[![NPM](https://img.shields.io/npm/l/tablab)](LICENSE)
[![npm](https://img.shields.io/npm/v/tablab)](https://www.npmjs.com/package/tablab)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)
[![npm](https://img.shields.io/npm/dt/tablab)](https://www.npmjs.com/package/tablab)
[![Coverage Status](https://coveralls.io/repos/github/raphael-jorge/tablab/badge.svg?branch=main)](https://coveralls.io/github/raphael-jorge/tablab?branch=main)

Tablab is a javascript library to write tablatures. It provides two different ways for writing them:

- **[Step by step](#writing-a-tablature-step-by-step)**: With this strategy, you must create a tablature instance and specify each operation to write the desired tablature;
- **[From a text input of instructions](#writing-a-tablature-from-a-text-input-of-instructions)**: In this case, you must create a parser instance to read these instructions. Once read, the resulting parsed instructions can be used with an instruction writer factory to determine and perform the corresponding writing operations to a tablature instance.

## Table of Content <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
  - [Writing a tablature step by step](#writing-a-tablature-step-by-step)
  - [Writing a tablature from a text input of instructions](#writing-a-tablature-from-a-text-input-of-instructions)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Install

With [node](https://nodejs.org/en/) installed, run

```shell
npm install tablab
```

## Usage

### Writing a tablature step by step

The `Tab` class provides the functionalities to write a tablature step by step. With it, you can write [notes](docs/tab/tab-api.md#write-note), [header messages](docs/tab/tab-api.md#write-header), [footer messages](docs/tab/tab-api.md#write-footer), [change its spacing](docs/tab/tab-api.md#set-spacing) and [add new blocks](docs/tab/tab-api.md#add-block) to your tablature. Once done writing your tablature, you can [format](docs/tab/tab-api.md#format) it as intended.

Check out the `Tab` class [usage documentation](docs/tab/tab-api.md) for more information about:

- The available [options](docs/tab/tab-api.md#tablature-options) to customize your tablature;
- The available [methods](docs/tab/tab-api.md#tablature-methods) to perform the writing operations.

Below, an example of how the `Tab` class can be used to write a tablature:

```js
const { Tab, Note } = require('tablab');

const cMajorChord = [
  new Note(1, '0'),
  new Note(2, '1'),
  new Note(3, '0'),
  new Note(4, '2'),
  new Note(5, '3'),
];

const eMajorChord = [
  new Note(1, '0'),
  new Note(2, '0'),
  new Note(3, '1'),
  new Note(4, '2'),
  new Note(5, '2'),
  new Note(6, '0'),
];

const tab = new Tab();

tab
  .writeHeader('Simple Notes Example')
  .writeNote(new Note(1, '0'))
  .setSpacing(2)
  .writeNote(new Note(2, '1'))
  .writeNote(new Note(3, '2'))
  .writeNote(new Note(4, '1/3'))
  .writeNote(new Note(5, '3'))
  .writeNote(new Note(6, '1'))
  .writeNote(new Note(5, '2'))
  .writeNote(new Note(4, '3'))
  .writeNote(new Note(3, '1h3'))
  .writeNote(new Note(2, '3p1'))
  .writeNote(new Note(1, '2'))
  .writeFooter('x2')
  .addBlock()
  .setSpacing(5)
  .writeHeader('Chord Example (C Major)')
  .writeParallelNotes(cMajorChord)
  .writeParallelNotes(cMajorChord)
  .addBlock()
  .writeHeader('Chord Example (E Major)')
  .writeParallelNotes(eMajorChord)
  .writeParallelNotes(eMajorChord);

console.log(tab.format(50));
```

outputs

```
[
  [
    '   | Simple Notes Example                     |   ',
    '---|---0-----------------------------------2--|---',
    '---|------1---------------------------3p1-----|---',
    '---|---------2-------------------1h3----------|---',
    '---|------------1/3-----------3---------------|---',
    '---|-----------------3-----2------------------|---',
    '---|--------------------1---------------------|---',
    '   |                                       x2 |   '
  ],
  [
    '     | Chord Example (C Major)                    ',
    '-----|-----0-----0--------------------------------',
    '-----|-----1-----1--------------------------------',
    '-----|-----0-----0--------------------------------',
    '-----|-----2-----2--------------------------------',
    '-----|-----3-----3--------------------------------',
    '-----|--------------------------------------------',
    '     |                                            '
  ],
  [
    '     | Chord Example (E Major)                    ',
    '-----|-----0-----0--------------------------------',
    '-----|-----0-----0--------------------------------',
    '-----|-----1-----1--------------------------------',
    '-----|-----2-----2--------------------------------',
    '-----|-----2-----2--------------------------------',
    '-----|-----0-----0--------------------------------',
    '     |                                            '
  ]
]
```

### Writing a tablature from a text input of instructions

As in the strategy [step by step](#writing-a-tablature-step-by-step), the `Tab` class is responsible for managing the tablature. The difference from this strategy is that instead of calling each method direct from a tablature instance, the writing operations will be determined from a text input of instructions.

`Tablab` provides the `Parser` class to read the given text input of instructions and determine the writing operation to be performed over the tablature for each parsed instruction.

Check out the `Parser` class [usage documentation](docs/parser/parser-api.md) for more information about:

- The [accepted instructions](docs/parser/parser-api.md#accepted-instructions);
- How to [write a tablature with the parsed instructions](docs/parser/parser-api.md#writing-a-tablature-with-the-parsed-instructions);
- The available [options](docs/parser/parser-api.md#parser-options) to customize the parser;
- The available [methods](docs/parser/parser-api.md#parser-methods) to parse instructions.

Below, an example of how the `Parser` class can be used with the `Tab` class to write a tablature:

```js
const { Tab, Parser } = require('tablab');

const instructions =
  'header(Simple Notes Example) 1-0 spacing(2) ' +
  '2-1 3-2 4-1/3 5-3 6-1 5-2 4-3 3-1h3 2-3p1 1-2 footer(x2) break spacing(5) ' +
  'header(Chord Example (C Major)) merge{ 1-0 2-1 3-0 4-2 5-3 } ' +
  'merge{ 1-0 2-1 3-0 4-2 5-3 } break header(Chord Example (E Major)) ' +
  'merge{ 1-0 2-0 3-1 4-2 5-2 6-0 } merge{ 1-0 2-0 3-1 4-2 5-2 6-0 }';

const tab = new Tab();
const parser = new Parser();

parser.parseAll(instructions).forEach((parsedInstruction) => {
  const writeResult = parsedInstruction.writeOnTab(tab);

  if (!writeResult.success) {
    console.log(
      `Failed to write instruction < ${parsedInstruction.value} > at position ` +
        `${parsedInstruction.readFromIndex}. (${writeResult.failureReasonIdentifier}) ` +
        `- ${writeResult.failureMessage} `
    );
  }
});

console.log(tab.format(50));
```

outputs

```
[
  [
    '   | Simple Notes Example                     |   ',
    '---|---0-----------------------------------2--|---',
    '---|------1---------------------------3p1-----|---',
    '---|---------2-------------------1h3----------|---',
    '---|------------1/3-----------3---------------|---',
    '---|-----------------3-----2------------------|---',
    '---|--------------------1---------------------|---',
    '   |                                       x2 |   '
  ],
  [
    '     | Chord Example (C Major)                    ',
    '-----|-----0-----0--------------------------------',
    '-----|-----1-----1--------------------------------',
    '-----|-----0-----0--------------------------------',
    '-----|-----2-----2--------------------------------',
    '-----|-----3-----3--------------------------------',
    '-----|--------------------------------------------',
    '     |                                            '
  ],
  [
    '     | Chord Example (E Major)                    ',
    '-----|-----0-----0--------------------------------',
    '-----|-----0-----0--------------------------------',
    '-----|-----1-----1--------------------------------',
    '-----|-----2-----2--------------------------------',
    '-----|-----2-----2--------------------------------',
    '-----|-----0-----0--------------------------------',
    '     |                                            '
  ]
]
```

## Acknowledgments

The Tablab's parser was highly inspired by the [Latex](https://www.latex-project.org/) project, a text preparation system. It provides a creative solution that decouples the document operations of writing them and designing them. If you have already struggled with writing documents, and adjusting their layout, make sure to check it out.

## License

[MIT](LICENSE)
