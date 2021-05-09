
# Tablab

![NPM](https://img.shields.io/npm/l/tablab)
![npm](https://img.shields.io/npm/v/tablab)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![npm](https://img.shields.io/npm/dt/tablab)

Tablab is a javascript library to write tablatures. It provides two different ways for writing them:
* **[Step by step](#writing-a-tablature---step-by-step)**: With this strategy, you must create a tablature instance and specify each operation to write the desired tablature;
* **[From a text input of instructions](#writing-a-tablature---from-a-text-input-of-instructions)**: In this case, you must create a parser instance to read these instructions. Once read, the resulting data can be used with an instruction factory to determine and perform the corresponding writing operations to a tablature instance.

## Table of Content
  * [Install](#install)
  * [Usage](#usage)
    + [Writing a Tablature - Step by Step](#writing-a-tablature---step-by-step)
    + [Writing a Tablature - From a Text Input of Instructions](#writing-a-tablature---from-a-text-input-of-instructions)
  * [API](#api)
  * [Acknowledgments](#acknowledgments)
  * [See Also](#see-also)
  * [License](#license)

## Install

With [npm](https://npmjs.org/) installed, run

```
npm install tablab --save
```

## Usage

### Writing a Tablature - Step by Step

Once a `Tab` instance is created, you may use its methods to write your desired tablature, step by step.

```js
var { Tab, Note } = require("tablab");

const cMajorChord = [
  new Note(1, "0"),
  new Note(2, "1"),
  new Note(3, "0"),
  new Note(4, "2"),
  new Note(5, "3"),
];

const eMajorChord = [
  new Note(1, "0"),
  new Note(2, "0"),
  new Note(3, "1"),
  new Note(4, "2"),
  new Note(5, "2"),
  new Note(6, "0"),
];

const tab = new Tab();

tab
  .writeHeader("Simple Notes Example")
  .writeNote(new Note(1, "0"))
  .setSpacing(2)
  .writeNote(new Note(2, "1"))
  .writeNote(new Note(3, "2"))
  .writeNote(new Note(4, "1/3"))
  .writeNote(new Note(5, "3"))
  .writeNote(new Note(6, "1"))
  .writeNote(new Note(5, "2"))
  .writeNote(new Note(4, "3"))
  .writeNote(new Note(3, "1h3"))
  .writeNote(new Note(2, "3p1"))
  .writeNote(new Note(1, "2"))
  .writeFooter("x2")
  .addBlock()
  .setSpacing(5)
  .writeHeader("Chord Example (C Major)")
  .writeParallelNotes(cMajorChord)
  .writeParallelNotes(cMajorChord)
  .addBlock()
  .writeHeader("Chord Example (E Major)")
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
    '    | Chord Example (C Major)                     ',
    '----|----0----0-----------------------------------',
    '----|----1----1-----------------------------------',
    '----|----0----0-----------------------------------',
    '----|----2----2-----------------------------------',
    '----|----3----3-----------------------------------',
    '----|---------------------------------------------',
    '    |                                             '
  ],
  [
    '    | Chord Example (E Major)                     ',
    '----|----0----0-----------------------------------',
    '----|----0----0-----------------------------------',
    '----|----1----1-----------------------------------',
    '----|----2----2-----------------------------------',
    '----|----2----2-----------------------------------',
    '----|----0----0-----------------------------------',
    '    |                                             '
  ]
]
```

Check out the `Tab` class [usage documentation](src/tab/README.md) for more information about the available options while creating a tablature instance and the available methods to perform the writing operations.

### Writing a Tablature - From a Text Input of Instructions

With a `Parser` instance created, you may use it to parse a set of instructions. The parsed instruction data can then be read by an `InstructionFactory` instance to determine the corresponding writing operation in the form of an `Instruction` instance. This instance can then be used to perform the writing operation on a tablature instance.

```js
const { Tab, Parser, InstructionFactory } = require("tablab");

const instructions = [
  "header(Simple Notes Example)",
  "1-0",
  "spacing(2)",
  "2-1",
  "3-2",
  "4-1/3",
  "5-3",
  "6-1",
  "5-2",
  "4-3",
  "3-1h3",
  "2-3p1",
  "1-2",
  "footer(x2)",
  "break",
  "spacing(5)",
  "header(Chord Example (C Major))",
  "merge{ 1-0 2-1 3-0 4-2 5-3 }",
  "merge{ 1-0 2-1 3-0 4-2 5-3 }",
  "break",
  "header(Chord Example (E Major))",
  "merge{ 1-0 2-0 3-1 4-2 5-2 6-0 }",
  "merge{ 1-0 2-0 3-1 4-2 5-2 6-0 }",
];

const instructionsString = instructions.join(" ");

const tab = new Tab();
const parser = new Parser();
const instructionFactory = new InstructionFactory();

parser.parseAll(instructionsString).forEach((result) => {
  const instruction = instructionFactory.getInstruction(result);
  const instructionWriteResult = instruction.writeOnTab(tab);

  if (!instructionWriteResult.success) {
    console.log(
      `Failed to write instruction < ${result.value} > at position ` +
        `${result.readFromIndex}. (${instructionWriteResult.failureReasonIdentifier}) ` +
        `- ${instructionWriteResult.failureMessage} `
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

Check out the `Parser` class [usage documentation](src/parser/README.md) for more details on parsing instructions.

## API

```js
var tablab = require('tablab')
```

See [api_formatting.md](api_formatting.md) for tips.

## Acknowledgments

The Tablab's parser was highly inspired by the [Latex](https://www.latex-project.org/) project, a text preparation system. It provides a creative solution that decouples the document operations of writing them and designing them. If you have already struggled with writing documents, and adjusting their layout, make sure to check it out.

## See Also

- [`noffle/common-readme`](https://github.com/noffle/common-readme)
- ...

## License

[MIT](LICENSE)

