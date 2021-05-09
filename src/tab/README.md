# Writing a Tablature - Step by Step

The `Tab` class provides methods to write a tablature. An instance of it can be created as indicated below:

```js
const { Tab } = require("tablab");

const tab = new Tab();
```

Check out the available [options](#tablature-options) and [methods](#tablature-methods).

## Table of Content
- [Tablature Options](#tablature-options)
  * [Number of Strings](#number-of-strings)
  * [Section Division Character](#section-division-character)
  * [Spacing](#spacing)
  * [Spacing Character](#spacing-character)
- [Tablature Methods](#tablature-methods)
  * [Add Block](#add-block)
  * [Add Spacing](#add-spacing)
  * [Format](#format)
  * [Remove Spacing](#remove-spacing)
  * [Write Footer](#write-footer)
  * [Write Header](#write-header)
  * [Write Note](#write-note)
  * [Write Parallel Notes](#write-parallel-notes)

## Tablature Options
The following options can be used to customize your tablature:
  * [numberOfStrings](#number-of-strings): The number of strings represented in the tablature. Defaults to `6`;
  * [sectionDivisionCharacter](#section-division-character): The string character used to mark headers and footers divisions in the tablature. Defaults to `|`;
  * [spacing](#spacing): The initial spacing value between notes in the tablature. Defaults to `3`;
  * [spacingCharacter](#spacing-character): The string character used to represent a spacing character in the section of strings of the tablature. Defaults to `-`;

### Number of Strings

```js
const tab = new Tab({
  numberOfStrings: 4,
});

tab
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"));

console.log(tab.format(50));
```

outputs

```
[
  [
    '                                                  ',
    '---0----------------------------------------------',
    '-------0------------------------------------------',
    '-----------0--------------------------------------',
    '---------------0----------------------------------',
    '                                                  '
  ]
]
```

### Section Division Character

```js
const tab = new Tab({
  sectionDivisionCharacter: "#",
});

tab
  .writeHeader("Section Division Character Header Example")
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"))
  .writeFooter("Section Division Character Footer Example");

console.log(tab.format(55));
```

outputs
```
[
  [
    '   # Section Division Character Header Example   #     ',
    '---#---0-----------------------------------------#-----',
    '---#-------0-------------------------------------#-----',
    '---#-----------0---------------------------------#-----',
    '---#---------------0-----------------------------#-----',
    '---#-------------------0-------------------------#-----',
    '---#-----------------------0---------------------#-----',
    '   #   Section Division Character Footer Example #     '
  ]
]
```

### Spacing

```js
const tab = new Tab({
  spacing: 6,
});

tab
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"));

console.log(tab.format(50));
```

outputs
```
[
  [
    '                                                  ',
    '------0-------------------------------------------',
    '-------------0------------------------------------',
    '--------------------0-----------------------------',
    '---------------------------0----------------------',
    '----------------------------------0---------------',
    '-----------------------------------------0--------',
    '                                                  '
  ]
]
```

The `spacing` property of the tablature instance can be changed to set the desired spacing between each note in the tablature:

```js
const tab = new Tab({
  spacing: 6,
});

tab
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .setSpacing(1) // fluent api option
  .writeNote(new Note(4, "0"));

tab.spacing = 6; // property assignment option

tab
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"));

console.log(tab.format(50));
```

outputs
```
[
  [
    '                                                  ',
    '------0-------------------------------------------',
    '-------------0------------------------------------',
    '--------------------0-----------------------------',
    '----------------------0---------------------------',
    '-----------------------------0--------------------',
    '------------------------------------0-------------',
    '                                                  '
  ]
]
```

### Spacing Character

```js
const tab = new Tab({
  spacingCharacter: "=",
});

tab
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"));

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '===0==============================================',
    '=======0==========================================',
    '===========0======================================',
    '===============0==================================',
    '===================0==============================',
    '=======================0==========================',
    '                                                  '
  ]
]
```

## Tablature Methods

A tablature instance exposes the following methods to perform different writing operations:
  * [addBlock](#add-block): Adds a block to the tablature;
  * [addSpacing](#add-spacing): Adds spacing to the tablature;
  * [format](#format): Formats the tablature adjusting each block to a specified length;
  * [removeSpacing](#remove-spacing): Removes spacing from the tablature;
  * [writeFooter](#write-footer): Writes a message to the footer section of the tablature. A section division will be written after the message;
  * [writeHeader](#write-header): Writes a message to the header section of the tablature. A section division will be written before the message;
  * [writeNote](#write-note): Writes a note to the tablature;
  * [writeParallelNotes](#write-parallel-notes): Writes multiple notes to the tablature in parallel.

### Add Block
```js
const tab = new Tab();

tab
  .writeHeader("First Block")
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"))
  .addBlock()
  .writeHeader("Second Block")
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"));

console.log(tab.format(50));
```
outputs
```
[
  [
    '   | First Block                                  ',
    '---|---0------------------------------------------',
    '---|-------0--------------------------------------',
    '---|-----------0----------------------------------',
    '---|---------------0------------------------------',
    '---|-------------------0--------------------------',
    '---|-----------------------0----------------------',
    '   |                                              '
  ],
  [
    '   | Second Block                                 ',
    '---|---0------------------------------------------',
    '---|-------0--------------------------------------',
    '---|-----------0----------------------------------',
    '---|---------------0------------------------------',
    '---|-------------------0--------------------------',
    '---|-----------------------0----------------------',
    '   |                                              '
  ]
]
```

### Add Spacing
```js
const tab = new Tab();

tab
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .addSpacing(3)
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .addSpacing(3)
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"));

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '---0----------------------------------------------',
    '-------0------------------------------------------',
    '--------------0-----------------------------------',
    '------------------0-------------------------------',
    '-------------------------0------------------------',
    '-----------------------------0--------------------',
    '                                                  '
  ]
]
```

### Format
The `format` method is used to format the tablature. The result is of the type `string[][]`. Each element of the resulting formatted tablature array is a formatted tablature block. Each block is composed of the following elements:
  * The first string element is the block header;
  * The last string element is the block footer;
  * The string elements in between the first and last elements are the block strings.

Once called you must provide the desired length expected for each block.

```js
const tab = new Tab();

tab
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"));

console.log("Block length of 20:");
console.log(tab.format(20));

console.log("Block length of 50:");
console.log(tab.format(50));
```
outputs
```
Block length of 20:
[
  [
    '                    ',
    '---0----------------',
    '-------0------------',
    '-----------0--------',
    '---------------0----',
    '--------------------',
    '--------------------',
    '                    '
  ],
  [
    '                    ',
    '--------------------',
    '--------------------',
    '--------------------',
    '--------------------',
    '-0------------------',
    '-----0--------------',
    '                    '
  ]
]
Block length of 50:
[
  [
    '                                                  ',
    '---0----------------------------------------------',
    '-------0------------------------------------------',
    '-----------0--------------------------------------',
    '---------------0----------------------------------',
    '-------------------0------------------------------',
    '-----------------------0--------------------------',
    '                                                  '
  ]
]
```

### Remove Spacing
```js
const tab = new Tab();

tab
  .writeNote(new Note(1, "0"))
  .removeSpacing(2)
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .removeSpacing(2)
  .writeNote(new Note(4, "0"))
  .writeNote(new Note(5, "0"))
  .removeSpacing(2)
  .writeNote(new Note(6, "0"));

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '---0----------------------------------------------',
    '-----0--------------------------------------------',
    '---------0----------------------------------------',
    '-----------0--------------------------------------',
    '---------------0----------------------------------',
    '-----------------0--------------------------------',
    '                                                  '
  ]
]
```

### Write Footer
```js
const tab = new Tab();

tab
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeFooter("Footer 1")
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .writeFooter("Footer 2")
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"))
  .writeFooter("Footer 3");

console.log(tab.format(50));
```
outputs
```
[
  [
    '            |            |            |           ',
    '---0--------|------------|------------|-----------',
    '-------0----|------------|------------|-----------',
    '------------|---0--------|------------|-----------',
    '------------|-------0----|------------|-----------',
    '------------|------------|---0--------|-----------',
    '------------|------------|-------0----|-----------',
    '   Footer 1 |   Footer 2 |   Footer 3 |           '
  ]
]
```

### Write Header
```js
const tab = new Tab();

tab
  .writeHeader("Header 1")
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeHeader("Header 2")
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .writeHeader("Header 3")
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"));

console.log(tab.format(50));
```
outputs
```
[
  [
    '   | Header 1   | Header 2   | Header 3           ',
    '---|---0--------|------------|--------------------',
    '---|-------0----|------------|--------------------',
    '---|------------|---0--------|--------------------',
    '---|------------|-------0----|--------------------',
    '---|------------|------------|---0----------------',
    '---|------------|------------|-------0------------',
    '   |            |            |                    '
  ]
]
```

### Write Note
```js
const tab = new Tab();

tab
  .writeNote(new Note(1, "0"))
  .writeNote(new Note(2, "0"))
  .writeNote(new Note(3, "0"))
  .writeNote(new Note(4, "0"))
  .writeNote(new Note(5, "0"))
  .writeNote(new Note(6, "0"));

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '---0----------------------------------------------',
    '-------0------------------------------------------',
    '-----------0--------------------------------------',
    '---------------0----------------------------------',
    '-------------------0------------------------------',
    '-----------------------0--------------------------',
    '                                                  '
  ]
]
```

### Write Parallel Notes
```js
const tab = new Tab();

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

tab
  .writeParallelNotes(cMajorChord)
  .writeParallelNotes(cMajorChord)
  .writeParallelNotes(eMajorChord)
  .writeParallelNotes(eMajorChord);

console.log(tab.format(50));
```
outputs
```
[
  [
    '                                                  ',
    '---0---0---0---0----------------------------------',
    '---1---1---0---0----------------------------------',
    '---0---0---1---1----------------------------------',
    '---2---2---2---2----------------------------------',
    '---3---3---2---2----------------------------------',
    '-----------0---0----------------------------------',
    '                                                  '
  ]
]
```