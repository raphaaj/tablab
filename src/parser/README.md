# Parsing Instructions

The `Parser` class provides methods to parse a text input of instructions, which can then be used to write a tablature. An instance of it can be created as indicated below:

```js
const { Parser } = require("tablab");

const parser = new Parser();
```

Check out the [accepted instruction formats](#accepted-instruction-formats) for more information on how to use the parser.

## Table of Content
  * [Accepted Instruction Formats](#accepted-instruction-formats)
    + [Basic Instructions](#basic-instructions)
    + [Method Instructions](#method-instructions)
  * [Parser Options](#parser-options)
    + [Mapped Method Instruction Aliases (methodInstructionAlias2IdentifierMap)](#mapped-method-instruction-aliases-methodinstructionalias2identifiermap)
    + [Method Instruction Arguments Enclosure](#method-instruction-arguments-enclosure)
    + [Method Instruction Arguments Separator](#method-instruction-arguments-separator)
    + [Method Instruction Targets Enclosure](#method-instruction-targets-enclosure)
  * [Parser Methods](#parser-methods)

## Accepted Instruction Formats

### Basic Instructions

A basic instruction has the format `{string}-{fret}` where the `fret` represents the instruction that should be written at the nth `string` of the tablature. Check out some examples below:
  * `1-0`: First string, open;

    ```js
    console.log(parser.parseOne("1-0"));
    ```
    outputs
    ```
    {
      value: '1-0',
      readFromIndex: 0,
      readToIndex: 2,
      method: null
    }
    ```
  * `2-0`: Second string, open;

    ```js
    console.log(parser.parseOne("2-0"));
    ```
    outputs
    ```
    {
      value: '2-0',
      readFromIndex: 0,
      readToIndex: 2,
      method: null
    }
    ```
  * `3-5`: Fifth fret of the third string;

    ```js
    console.log(parser.parseOne("3-5"));
    ```
    outputs
    ```
    {
      value: '3-5',
      readFromIndex: 0,
      readToIndex: 2,
      method: null
    }
    ```
  * `1-3`: Third fret of the first string;

    ```js
    console.log(parser.parseOne("1-3"));
    ```
    outputs
    ```
    {
      value: '1-3',
      readFromIndex: 0,
      readToIndex: 2,
      method: null
    }
    ```
  * `4-5h7`: Fifth fret of the fourth string followed by a *hammer-on* at the seventh fret;

    ```js
    console.log(parser.parseOne("4-5h7"));
    ```
    outputs
    ```
    {
      value: '4-5h7',
      readFromIndex: 0,
      readToIndex: 4,
      method: null
    }
    ```
  * `3-5b6`: Fifth fret of the third string followed by a half bend.

    ```js
    console.log(parser.parseOne("3-5b6"));
    ```
    outputs
    ```
    {
      value: '3-5b6',
      readFromIndex: 0,
      readToIndex: 4,
      method: null
    }
    ```

### Method Instructions

A method instruction is composed of up to 3 parts:
  * The method alias (required): It is a text composed of letters in the range [a-zA-Z] used to identify the method instruction.
  * The method arguments (optional): A set of values enclosed by brackets. These values may be used when writing the instruction to the tablature.
  * The method targets (optional): A set of instructions, either basic ones or method ones, enclosed by brackets. These instructions will be parsed with the method instruction and may be used when writing the instruction to the tablature.

Check out some examples of method instructions below:
  * `break`
    * Alias: `break`
    * Arguments: None
    * Targets: None

    ```js
    console.log(parser.parseOne("break"));
    ```
    outputs
    ```
    {
      value: 'break',
      readFromIndex: 0,
      readToIndex: 4,
      method: {
        alias: 'break',
        args: [],
        identifier: 'BREAK',
        targets: []
      }
    }
    ```
  * `repeat ( 3 ) { 1-0 2-0 }`
    * Alias: `repeat`
    * Arguments: `3`
    * Targets: `1-0` and `2-0`

    ```js
    console.log(parser.parseOne("repeat ( 3 ) { 1-0 2-0 }"));
    ```
    outputs
    ```
    {
      value: "repeat ( 3 ) { 1-0 2-0 }",
      readFromIndex: 0,
      readToIndex: 23,
      method: {
        alias: "repeat",
        args: ["3"],
        identifier: "REPEAT",
        targets: [
          {
            value: "1-0",
            readFromIndex: 15,
            readToIndex: 17,
            method: null
          },
          {
            value: "2-0",
            readFromIndex: 19,
            readToIndex: 21,
            method: null
          }
        ]
      }
    }
    ```
  * `merge { 6-3 5-5 4-5 }`
    * Alias: `merge`
    * Arguments: None
    * Targets: `6-3`, `5-5` and `4-5`

    ```js
    console.log(parser.parseOne("merge { 6-3 5-5 4-5 }"));
    ```
    outputs
    ```
    {
      value: "merge { 6-3 5-5 4-5 }",
      readFromIndex: 0,
      readToIndex: 20,
      method: {
        alias: "merge",
        args: [],
        identifier: "MERGE",
        targets: [
          {
            value: "6-3",
            readFromIndex: 8,
            readToIndex: 10,
            method: null
          },
          {
            value: "5-5",
            readFromIndex: 12,
            readToIndex: 14,
            method: null
          },
          {
            value: "4-5",
            readFromIndex: 16,
            readToIndex: 18,
            method: null
          }
        ]
      }
    }
    ```
  * `header ( some header )`
    * Alias: `header`
    * Arguments: `some header`
    * Targets: None

    ```js
    console.log(parser.parseOne("header ( some header )"));
    ```
    outputs
    ```
    {
      value: 'header ( some header )',
      readFromIndex: 0,
      readToIndex: 21,
      method: {
        alias: 'header',
        args: [ 'some header' ],
        identifier: 'WRITE_HEADER',
        targets: []
      }
    }
    ```

Check out the [Method Instruction Alias to Identifier Map](#method-instruction-alias-to-identifier-map) option for more details about:
  * The predefined aliases and the mapped instructions for each one;
  * How to customize the aliases for each instruction.

## Parser Options

### Method Instruction Alias to Identifier Map

Each method instruction alias maps to a specific [instruction](../instruction/README.md). The `methodInstructionAlias2IdentifierMap` option is used to determine the mapped instruction for each alias. Its value is an object where each key is an alias and the associated value for each key is the mapped instruction identifier. Its default value is:
```js
{
  break: 'BREAK',
  footer: 'WRITE_FOOTER',
  header: 'WRITE_HEADER',
  merge: 'MERGE',
  repeat: 'REPEAT',
  spacing: 'SET_SPACING'
}
```

This value results in the following map:
| Alias | Instruction |
| :---: | :---------: |
| `break` | [Break Instruction](../instruction/README.md#break) |
| `footer` | [Write Footer Instruction](../instruction/README.md#write-footer) |
| `header` | [Write Header Instruction](../instruction/README.md#write-header) |
| `merge` | [Merge Instruction](../instruction/README.md#merge) |
| `repeat` | [Repeat Instruction](../instruction/README.md#repeat) |
| `spacing` | [Set Spacing Instruction](../instruction/README.md#set-spacing) |

#### Defining Custom Aliases and Disabling Instructions
The `methodInstructionAlias2IdentifierMap` option can be used to add new custom aliases for the available instructions or to disable the parser to identify some of them.

In the following example, the parser is set to read the [break instruction](../instruction/README.md#break) only, under the aliases `break`, `addBlock` and `b`. Any other aliases will result in an unidentified instruction.

```js
const { Parser, MethodInstructionIdentifier } = require("tablab");

const parser = new Parser({
  methodInstructionAlias2IdentifierMap: {
    break: MethodInstructionIdentifier.Break, // 'BREAK'
    addBlock: MethodInstructionIdentifier.Break, // 'BREAK'
    b: MethodInstructionIdentifier.Break, // 'BREAK'
  },
});

const instructions = "break addBlock b merge { 1-0 2-0 }";
const parsedInstructions = parser.parseAll(instructions);
console.log(parsedInstructions);
```
outputs
```
[
  {
    value: "break",
    readFromIndex: 0,
    readToIndex: 4,
    method: {
      alias: "break",
      args: [],
      identifier: "BREAK", // Break instruction under alias "break"
      targets: []
    }
  },
  {
    value: "addBlock",
    readFromIndex: 6,
    readToIndex: 13,
    method: {
      alias: "addBlock",
      args: [],
      identifier: "BREAK", // Break instruction under alias "addBlock"
      targets: []
    }
  },
  {
    value: "b",
    readFromIndex: 15,
    readToIndex: 15,
    method: {
      alias: "b",
      args: [],
      identifier: "BREAK", // Break instruction under alias "b"
      targets: []
    }
  },
  {
    value: "merge { 1-0 2-0 }",
    readFromIndex: 17,
    readToIndex: 33,
    method: {
      alias: "merge",
      args: [],
      identifier: null, // Unidentified instruction under alias "merge"
      targets: [
        {
          value: "1-0",
          readFromIndex: 25,
          readToIndex: 27,
          method: null
        },
        {
          value: "2-0",
          readFromIndex: 29,
          readToIndex: 31,
          method: null
        }
      ]
    }
  }
]
```

If you just want to set additional aliases for specific instructions, you can set the `methodInstructionAlias2IdentifierMap` option based on its default value. In the following example, the parser reads all the predefined aliases but with one difference: It can read the [break instruction]() under the aliases `addBlock` and `b`, besides the default `break` alias.

```js
const { Parser, MethodInstructionIdentifier } = require("tablab");

const parser = new Parser({
  methodInstructionAlias2IdentifierMap: {
    ... Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP,
    addBlock: MethodInstructionIdentifier.Break, // 'BREAK'
    b: MethodInstructionIdentifier.Break, // 'BREAK'
  },
});
```

### Method Instruction Arguments Enclosure

```js
const { Parser, Enclosure } = require("tablab");

const parser = new Parser({
  methodInstructionArgsEnclosure: Enclosure.SquareBrackets,
});

const instructions = "repeat [ 3 ] { 1-0 2-0 }";
const parsedInstructions = parser.parseAll(instructions);
console.log(JSON.stringify(parsedInstructions, null, 2));
```
outputs
```
[
  {
    "value": "repeat [ 3 ] { 1-0 2-0 }",
    "readFromIndex": 0,
    "readToIndex": 23,
    "method": {
      "alias": "repeat",
      "args": [
        "3"
      ],
      "identifier": "REPEAT",
      "targets": [
        {
          "value": "1-0",
          "readFromIndex": 15,
          "readToIndex": 17,
          "method": null
        },
        {
          "value": "2-0",
          "readFromIndex": 19,
          "readToIndex": 21,
          "method": null
        }
      ]
    }
  }
]
```

### Method Instruction Arguments Separator

### Method Instruction Targets Enclosure

## Parser Methods
