# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0-alpha.2](https://github.com/raphael-jorge/tablab/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2021-09-13)

## [1.0.0-alpha.1](https://github.com/raphael-jorge/tablab/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2021-08-09)


### ⚠ BREAKING CHANGES

*   - It is not possible anymore to set a custom spacing character to be
  used at the header and footer sections of a tablature element.
  - It is not possible anymore to set a custom instructions separator
  character to be used by a parser instance.
* **instruction:** Changes in the InvalidInstructionReason enumerator:
- Members renamed:
  - UnmappedReason > UnknownReason;
  - MethodInstructionWithoutIdentifier > UnidentifiedMethodInstruction;
  - MethodInstructionWithUnmappedIdentifier > UnknownMethodInstruction;
  - WriteNoteInstructionInvalid > BasicInstructionInvalid;
  - WriteNoteInstructionWithNonWritableNote > BasicInstructionWithNonWritableNote;
  - WriteHeaderInstructionWithoutArguments > HeaderInstructionWithoutArguments;
  - WriteHeaderInstructionWithUnmappedArguments > HeaderInstructionWithUnmappedArguments;
  - WriteHeaderInstructionWithInvalidHeader > HeaderInstructionWithInvalidHeader;
  - WriteFooterInstructionWithoutArguments > FooterInstructionWithoutArguments;
  - WriteFooterInstructionWithUnmappedArguments > FooterInstructionWithUnmappedArguments;
  - WriteFooterInstructionWithInvalidFooter > FooterInstructionWithInvalidFooter;
  - SetSpacingInstructionWithoutArguments > SpacingInstructionWithoutArguments;
  - SetSpacingInstructionWithUnmappedArguments > SpacingInstructionWithUnmappedArguments;
  - SetSpacingInstructionWithInvalidSpacingValueType > SpacingInstructionWithInvalidSpacingValueType;
  - SetSpacingInstructionWithInvalidSpacingValue > SpacingInstructionWithInvalidSpacingValue;
- Member values updated.
* **parser:** Changes in the parser class:
- The field methodInstructionArgsOpeningEnclosure now becomes the
methodInstructionArgsEnclosure field, which receives a value of the
Enclosure enumerator.
- The field methodInstructionTargetsOpeningEnclosure now becomes the
methodInstructionTargetsEnclosure field, which receives a value of the
Enclosure enumerator.
- The static field DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE now
becomes the DEFAULT_METHOD_INSTRUCTION_ARGS_ENCLOSURE static field, which
has a value of the Enclosure enumerator.
- The static field DEFAULT_METHOD_INSTRUCTION_TARGETS_OPENING_ENCLOSURE
now becomes the DEFAULT_METHOD_INSTRUCTION_TARGETS_ENCLOSURE static field,
which has a value of the Enclosure enumerator.
* **tab:** Changes in the tablature element class:
- Rename field `filler` to `spacingCharacter`
- Rename filed `sectionFiller` to `sectionSpacingCharacter`
- Rename field `sectionSymbol` to `sectionDivisionCharacter`
- Rename static field `DEFAULT_FILLER` to `DEFAULT_SPACING_CHARACTER`
- Rename static field `DEFAULT_SECTION_FILLER` to `DEFAULT_SECTION_SPACING_CHARACTER`
- Rename static field `DEFAULT_SECTION_SYMBOL` to `DEFAULT_SECTION_DIVISION_CHARACTER`
- Rename method `getSectionFiller` to `getSectionSpacing`
- Rename method `getStringsFiller` to `getStringsSpacing`
* **instructions:** Move all invalid instruction reasons to the InvalidInstructionReason enumerator.
The InvalidInstructionBaseReason enumerator no longer exists.
* **tab:** Rename method `isNoteInStringsRange` at tablature elements to `isNoteWritable`
* **tab:** Rename fields at tablature elements:
- Rename static field `DEFAULT_NUMBER_OF_ROWS` at tablature elements to `DEFAULT_NUMBER_OF_STRINGS`
- Rename field `numberOfRows` at tablature elements to `numberOfStrings`
- Rename `getRowsFiller` method at tablature elements to `getStringsFiller`
- Rename `rows` field at tablature blocks to `strings`
* Rename elements in the public API and remove some
unecessary methods:

- Rename InstructionMethodData to MethodInstructionData
- Rename InstructionBuilder to MethodInstructionBuilder
- Rename instance property instructionMethodIdentifiersEnabled at
  InstructionFactoryBase to methodInstructionIdentifiersEnabled
- Rename instance property instructionMethodIdentifier2InstructionBuilderMap
  at InstructionFactoryBase to methodInstructionIdentifier2InstructionBuilderMap
- Rename InstructionMethodIdentifier to MethodInstructionIdentifier
- Rename MethodResult to ParsedMethodInstructionData. It no longer have
  the instance method named asInstructionMethodData.
- Rename ParserResult to ParsedInstructionData. It no longer have the instance
  method named asInstructionData.

### Features

* **parser:** allow parsed instructions to be written to tabs directly ([770999c](https://github.com/raphael-jorge/tablab/commit/770999c0c68df48f01e496f878d4de346df09629))
* remove not implemented options ([2d33f2e](https://github.com/raphael-jorge/tablab/commit/2d33f2ebd931ad991babfbabc9f076fd363ad2f1))
* **tab:** add a method to set a tab element spacing using the fluent API ([a894c9e](https://github.com/raphael-jorge/tablab/commit/a894c9e81315c86da1a9ebc7b296594b3a839382))


### Bug Fixes

* **tab:** fix the creation of empty blocks on formatting ([206e284](https://github.com/raphael-jorge/tablab/commit/206e28417d8506d0e582c3bc3207307424bb80d2))


### Code Refactoring

* **enclosures-helper:** update values of the Enclosure enum to reflect its keys ([cf9aacc](https://github.com/raphael-jorge/tablab/commit/cf9aacca64907ff58baf5252bdf8a751a1e0a606))
* **helpers:** remove circular dependency from string helper and enclosures helper ([e98c6e6](https://github.com/raphael-jorge/tablab/commit/e98c6e6c1e1d750b7d87a12dc5370ff41f83ca93))
* **instruction:** improve failure reasons identification and description ([ca1342c](https://github.com/raphael-jorge/tablab/commit/ca1342cf9eb0f347bd1d110b7c2ba30f69ff299d))
* **instruction:** simplify project structure ([02b6724](https://github.com/raphael-jorge/tablab/commit/02b67246b5c03330d9a82d2ee754969876e193ab))
* **instructions:** set the success property as a field at the InstructionWriteResult class ([1b3d59e](https://github.com/raphael-jorge/tablab/commit/1b3d59ea08c8b30f6a0d057f96b80eb47c536a5f))
* **instructions:** unify enumerators for invalid instruction reasons ([32769bf](https://github.com/raphael-jorge/tablab/commit/32769bf18a5f23d5e9daf50f258db8c342415aaf))
* **instructions:** update method instructions identifiers to reflect its default aliases ([ce382f0](https://github.com/raphael-jorge/tablab/commit/ce382f01290eb4438282b4aff65392c5e152bd6f))
* **parser:** rename fields of the parser to improve usability ([37f011a](https://github.com/raphael-jorge/tablab/commit/37f011a6d786a513b11fe44d310c901207fcc6f3))
* **tab:** rename fields and methods of the tablature element class to improve clarity ([0692ed1](https://github.com/raphael-jorge/tablab/commit/0692ed19195b82656832eaf978f31f04fe0c2a2e))
* **tab:** rename the method that checks if a note is writable to a tablature element ([347255d](https://github.com/raphael-jorge/tablab/commit/347255dc9f3b381cadf8066c61b6719c95ab6cd2))
* **tab:** use strings instead of rows to reference the strings section of tablature elements ([bd68c4a](https://github.com/raphael-jorge/tablab/commit/bd68c4aaf8e3d8f1140e9e4e38f5e8626e264fa0))
* uniformize names of variables and references ([30ff47b](https://github.com/raphael-jorge/tablab/commit/30ff47b76170ac34ca3810985fbb4eedf2ebde85))


### Build Operations

* add rollup bundler ([f555001](https://github.com/raphael-jorge/tablab/commit/f555001ad6ab0115a99b6459419a358765ede75a))
* update dependencies ([9a29c5b](https://github.com/raphael-jorge/tablab/commit/9a29c5b1685317c6abb2602179932c15d45594ab))

## 1.0.0-alpha.0 (2021-03-14)


### Features

* **instruction:** add instructions utilities to write tab ([b2210a4](https://github.com/raphael-jorge/tablab/commit/b2210a4448406fa905940d1bba1932f4eec36b51))
* **instruction:** add the instruction factory ([e08f4dc](https://github.com/raphael-jorge/tablab/commit/e08f4dc7bf0afaec410c3c843e08206fbee2365b))
* **parser:** add parser for instructions ([02f5b37](https://github.com/raphael-jorge/tablab/commit/02f5b3713e484217dd45ae7e51a84377de27eac3))
* **string-helper:** add function to format strings with replacers ([34645fc](https://github.com/raphael-jorge/tablab/commit/34645fca60eea7655a1905866d11585763f09e18))
* **tab:** add format functionality to tabs ([db74525](https://github.com/raphael-jorge/tablab/commit/db74525af212db62462680eaaca94212a8e6f634))
* **tab:** add tab writer ([81c72f1](https://github.com/raphael-jorge/tablab/commit/81c72f10b3cc4f6915c17067bd950a6ad3aa09bb))
* setup project dependencies ([b21c1d9](https://github.com/raphael-jorge/tablab/commit/b21c1d91c4c863894893c1dd541d2c22ff6e7456))
