# Instruction Factory

## Basic
Once written to a tablature, this instruction will [write a note](../tab/README.md#write-note) to it.
```js
const { Tab, Parser, InstructionFactory } = require("tablab");

const tab = new Tab();
const parser = new Parser();
const instructionFactory = new InstructionFactory();

const parsedInstruction = parser.parseOne("4-5h7");
const instruction = instructionFactory.getInstruction(parsedInstruction);
const instructionWriteResult = instruction.writeOnTab(tab);

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '---5h7--------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '                                                  '
  ]
]
```

## Break
Once written to a tablature, this instruction will [add a tablature block](../tab/README.md#add-block) to it.
  * **Identifier**: `BREAK`;
  * **Arguments**: None;
  * **Targets**: None.

```js
const { Tab, Parser, InstructionFactory } = require("tablab");

const tab = new Tab();
const parser = new Parser();
const instructionFactory = new InstructionFactory();

const parsedInstruction = parser.parseOne("break");
const instruction = instructionFactory.getInstruction(parsedInstruction);
const instructionWriteResult = instruction.writeOnTab(tab);

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '                                                  '
  ],
  [
    '                                                  ',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '                                                  '
  ]
]
```

## Write Footer
Once written to a tablature, this instruction will [write the given message to the footer section](../tab/README.md#write-footer) of the tablature.
  * **Identifier**: `WRITE_FOOTER`;
  * **Arguments**: The message to write at the footer section of the tablature;
  * **Targets**: None.

```js
const { Tab, Parser, InstructionFactory } = require("tablab");

const tab = new Tab();
const parser = new Parser();
const instructionFactory = new InstructionFactory();

const parsedInstruction = parser.parseOne("footer (My Footer 1)");
const instruction = instructionFactory.getInstruction(parsedInstruction);
const instructionWriteResult = instruction.writeOnTab(tab);

console.log(tab.format(50));
```
outputs
```
[
  [
    '               |                                  ',
    '---------------|----------------------------------',
    '---------------|----------------------------------',
    '---------------|----------------------------------',
    '---------------|----------------------------------',
    '---------------|----------------------------------',
    '---------------|----------------------------------',
    '   My Footer 1 |                                  '
  ]
]
```

## Write Header
Once written to a tablature, this instruction will [write the given message to the header section](../tab/README.md#write-header) of the tablature.
  * **Identifier**: `WRITE_HEADER`;
  * **Arguments**: The message to write at the header section of the tablature;
  * **Targets**: None.

```js
const { Tab, Parser, InstructionFactory } = require("tablab");

const tab = new Tab();
const parser = new Parser();
const instructionFactory = new InstructionFactory();

const parsedInstruction = parser.parseOne("header (My Header 1)");
const instruction = instructionFactory.getInstruction(parsedInstruction);
const instructionWriteResult = instruction.writeOnTab(tab);

console.log(tab.format(50));
```
outputs
```
[
  [
    '   | My Header 1                                  ',
    '---|----------------------------------------------',
    '---|----------------------------------------------',
    '---|----------------------------------------------',
    '---|----------------------------------------------',
    '---|----------------------------------------------',
    '---|----------------------------------------------',
    '   |                                              '
  ]
]
```

## Merge
Once written to a tablature, this instruction will [write the given target instructions in parallel](../tab/README.md#write-parallel-notes) to the tablature.
  * **Identifier**: `MERGE`;
  * **Arguments**: None;
  * **Targets**: The instructions to be written to the tablature in parallel.

```js
const { Tab, Parser, InstructionFactory } = require("tablab");

const tab = new Tab();
const parser = new Parser();
const instructionFactory = new InstructionFactory();

const parsedInstruction = parser.parseOne("merge { 6-3 5-5 4-5 }");
const instruction = instructionFactory.getInstruction(parsedInstruction);
const instructionWriteResult = instruction.writeOnTab(tab);

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '---5----------------------------------------------',
    '---5----------------------------------------------',
    '---3----------------------------------------------',
    '                                                  '
  ]
]
```

## Repeat
Once written to a tablature, this instruction will write the given target instructions to the tablature `n` times, where `n` is the given number of repetitions.
  * **Identifier**: `REPEAT`;
  * **Arguments**: The number of repetitions;
  * **Targets**: The instructions to be written to the tablature.

```js
const { Tab, Parser, InstructionFactory } = require("tablab");

const tab = new Tab();
const parser = new Parser();
const instructionFactory = new InstructionFactory();

const parsedInstruction = parser.parseOne("repeat (3) { 6-3 5-5 4-5 }");
const instruction = instructionFactory.getInstruction(parsedInstruction);
const instructionWriteResult = instruction.writeOnTab(tab);

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '-----------5-----------5-----------5--------------',
    '-------5-----------5-----------5------------------',
    '---3-----------3-----------3----------------------',
    '                                                  '
  ]
]
```

## Set Spacing
Once written to a tablature, this instruction will [set its spacing](../tab/README.md#spacing) property to the given spacing value.
  * **Identifier**: `SET_SPACING`;
  * **Arguments**: The new spacing value of the tablature;
  * **Targets**: None.

```js
const { Tab, Parser, InstructionFactory, Note } = require("tablab");

const tab = new Tab();
const parser = new Parser();
const instructionFactory = new InstructionFactory();

tab.writeNote(new Note(1, "0")).writeNote(new Note(2, "0"));

const parsedInstruction = parser.parseOne("spacing (1)");
const instruction = instructionFactory.getInstruction(parsedInstruction);
const instructionWriteResult = instruction.writeOnTab(tab);

tab.writeNote(new Note(3, "0")).writeNote(new Note(4, "0"));

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '---0----------------------------------------------',
    '-------0------------------------------------------',
    '---------0----------------------------------------',
    '-----------0--------------------------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '                                                  '
  ]
]
```