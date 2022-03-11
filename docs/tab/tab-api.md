# Tablab - Tab <!-- omit in toc -->

The `Tab` class provides methods to write a tablature. An instance of it can be created as indicated below:

```js
const { Tab } = require('tablab');

const tab = new Tab();
```

Check out the available [options](#tablature-options) and [methods](#tablature-methods).

## Table of content <!-- omit in toc -->

- [Tablature options](#tablature-options)
  - [Number of strings](#number-of-strings)
  - [Section division character](#section-division-character)
  - [Spacing](#spacing)
  - [Spacing Character](#spacing-character)
- [Tablature methods](#tablature-methods)
  - [Write note](#write-note)
  - [Write parallel notes](#write-parallel-notes)
  - [Write header](#write-header)
  - [Write footer](#write-footer)
  - [Set spacing](#set-spacing)
  - [Add block](#add-block)
  - [Format](#format)

## Tablature options

The following options can be set to customize your tablature:

- [Number of strings](#number-of-strings);
- [Section division character](#section-division-character);
- [Spacing](#spacing);
- [Spacing Character](#spacing-character).

### Number of strings

The `numberOfStrings` option is used to specify the number of strings in the tablature. The default value is `6`;

Below, an example of a 4 strings tablature:

```js
const tab = new Tab({ numberOfStrings: 4 });

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
    '                                                  '
  ]
]
```

### Section division character

The `sectionDivisionCharacter` option is used to specify the character used to mark section divisions in the tablature. This character is written to the tablature before every header section and after every footer section. The default value is `|`.

Check out the [writeHeader](#write-header) and [writeFooter](#write-footer) methods for more details on how the `sectionDivisionCharacter` is used.

Below, an example of a tablature where the `sectionDivisionCharacter` is set to `#`:

```js
const tab = new Tab({ sectionDivisionCharacter: '#' });

tab.writeHeader('Header Example').writeFooter('Footer Example');

console.log(tab.format(50));
```

outputs

```
[
  [
    '   # Header Example   #                           ',
    '---#------------------#---------------------------',
    '---#------------------#---------------------------',
    '---#------------------#---------------------------',
    '---#------------------#---------------------------',
    '---#------------------#---------------------------',
    '---#------------------#---------------------------',
    '   #   Footer Example #                           '
  ]
]
```

### Spacing

The `spacing` option is used to specify the initial spacing value between notes in the tablature. The default value is `3`;

Check out the [setSpacing](#set-spacing) method for details on how to change the spacing value.

Below, an example of a tablature where the initial spacing is set to 6.

```js
const tab = new Tab({ spacing: 6 });

tab
  .writeNote(new Note(1, '0'))
  .writeNote(new Note(2, '0'))
  .writeNote(new Note(3, '0'))
  .writeNote(new Note(4, '0'))
  .writeNote(new Note(5, '0'))
  .writeNote(new Note(6, '0'));

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

### Spacing Character

The `spacingCharacter` option is used to specify the character used to represent the lines of the tablature. The default value is `- `.

Below, an example of a tablature where the character used to represent its lines is set to `=`.

```js
const tab = new Tab({ spacingCharacter: '=' });

console.log(tab.format(50));
```

outputs

```
[
  [
    '                                                  ',
    '==================================================',
    '==================================================',
    '==================================================',
    '==================================================',
    '==================================================',
    '==================================================',
    '                                                  '
  ]
]
```

## Tablature methods

A tablature instance exposes the following methods to perform different writing operations:

- [Write note](#write-note);
- [Write parallel notes](#write-parallel-notes);
- [Write header](#write-header);
- [Write footer](#write-footer);
- [Set spacing](#set-spacing);
- [Add block](#add-block);
- [Format](#format).

### Write note

The `writeNote` method is responsible for writing a given note to the tablature.

A note is a representation of an instruction to be written to a specific string of the tablature. To create one, you must specify the following parameters:

- The number of the string;
- The instruction to write at that string.

In the example below, the created note indicates that, at the first string, the instruction `5` should be written.

```js
const { Note } = require('tablab');

const simpleNote = new Note(1, '5');
```

You can also create notes for more complex instructions like _hammer-ons_, _pull-offs_, _bends_, _slides_, and others, as intended. A few examples are provided below:

```js
const noteWithHammerOn = new Note(1, '3h5'); // Third fret of the first string followed by a hammer-on at the fifth fret
const noteWithPullOff = new Note(3, '7p5'); // Seventh fret of the third string followed by a pull-off to the fifth fret
const noteWithBendUp = new Note(3, '5b7'); // Fifth fret of the third string followed by a whole-step bend
const noteWithSlide = new Note(4, '7/9'); // Seventh fret of the fourth string followed by a slide to the ninth fret
```

Once your note is created you can call the `writeNote` method to write it to your tablature:

```js
const tab = new Tab();

tab
  .writeNote(simpleNote)
  .writeNote(noteWithHammerOn)
  .writeNote(noteWithPullOff)
  .writeNote(noteWithBendUp)
  .writeNote(noteWithSlide);

console.log(tab.format(50));
```

outputs

```
[
  [
    '                                                  ',
    '---5---3h5----------------------------------------',
    '--------------------------------------------------',
    '-------------7p5---5b7----------------------------',
    '-------------------------7/9----------------------',
    '--------------------------------------------------',
    '--------------------------------------------------',
    '                                                  '
  ]
]
```

Check out the [writeParallelNotes](#write-parallel-notes) method if you need to write multiple notes in parallel, i.e., in the same tablature time.

### Write parallel notes

The `writeParallelNotes` method is responsible for writing multiple notes to the tablature in parallel.

```js
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

### Write header

The `writeHeader` method is responsible for writing a given message to the header section of the tablature. It will write a `sectionDivisionCharacter` before the header message on every line of the tablature.

```js
const tab = new Tab();

tab
  .writeHeader('Header 1')
  .writeNote(new Note(1, '0'))
  .writeNote(new Note(2, '0'))
  .writeHeader('Header 2')
  .writeNote(new Note(3, '0'))
  .writeNote(new Note(4, '0'))
  .writeHeader('Header 3')
  .writeNote(new Note(5, '0'))
  .writeNote(new Note(6, '0'));

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

### Write footer

The `writeFooter` method is responsible for writing a given message to the footer section of the tablature. It will write a `sectionDivisionCharacter` after the footer message on every line of the tablature.

```js
const tab = new Tab();

tab
  .writeNote(new Note(1, '0'))
  .writeNote(new Note(2, '0'))
  .writeFooter('Footer 1')
  .writeNote(new Note(3, '0'))
  .writeNote(new Note(4, '0'))
  .writeFooter('Footer 2')
  .writeNote(new Note(5, '0'))
  .writeNote(new Note(6, '0'))
  .writeFooter('Footer 3');

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

### Set spacing

The `setSpacing` method is responsible for updating the [spacing](#spacing) value between notes in the tablature to a new given value.

```js
const tab = new Tab();

tab
  .setSpacing(6)
  .writeNote(new Note(1, '0'))
  .writeNote(new Note(2, '0'))
  .writeNote(new Note(3, '0'))
  .setSpacing(2)
  .writeNote(new Note(4, '0'))
  .setSpacing(6)
  .writeNote(new Note(5, '0'))
  .writeNote(new Note(6, '0'));

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
    '-----------------------0--------------------------',
    '------------------------------0-------------------',
    '-------------------------------------0------------',
    '                                                  '
  ]
]
```

### Add block

The `addBlock` method is responsible for adding new blocks to the tablature, allowing you to break your tablature in blocks, as intended.

In the example below, the tablature was divided into two blocks:

```js
const tab = new Tab();

tab
  .writeHeader('First Block')
  .writeNote(new Note(1, '0'))
  .writeNote(new Note(2, '0'))
  .writeNote(new Note(3, '0'))
  .addBlock()
  .writeHeader('Second Block')
  .writeNote(new Note(4, '0'))
  .writeNote(new Note(5, '0'))
  .writeNote(new Note(6, '0'));

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
    '---|----------------------------------------------',
    '---|----------------------------------------------',
    '---|----------------------------------------------',
    '   |                                              '
  ],
  [
    '   | Second Block                                 ',
    '---|----------------------------------------------',
    '---|----------------------------------------------',
    '---|----------------------------------------------',
    '---|---0------------------------------------------',
    '---|-------0--------------------------------------',
    '---|-----------0----------------------------------',
    '   |                                              '
  ]
]
```

### Format

The `format` method is responsible for formatting the tablature. The result is an array of tablature blocks, where each block is an array of strings. Each tablature block is composed of the following elements:

- The first string element is the block header section;
- The last string element is the block footer section;
- The string elements in between the first and last elements are the block strings.

Once called, you must provide the desired length expected for each block.

```js
const tab = new Tab();

tab
  .writeNote(new Note(1, '0'))
  .writeNote(new Note(2, '0'))
  .writeNote(new Note(3, '0'))
  .writeNote(new Note(4, '0'))
  .writeNote(new Note(5, '0'))
  .writeNote(new Note(6, '0'));

console.log('Block length of 20:');
console.log(tab.format(20));

console.log('Block length of 50:');
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
