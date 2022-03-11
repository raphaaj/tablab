# Tablab - Failure Reasons

## General

Failure reasons regarding instructions in general:

| Failure Reason Identifier |          Description          |
| :-----------------------: | :---------------------------: |
|     `UNKNOWN_REASON`      | An unexpected error occurred. |

## Basic Instructions

Failure reasons regarding [basic instructions](../parser/README.md#basic-instructions):

|         Failure Reason Identifier          |                                   Description                                    |
| :----------------------------------------: | :------------------------------------------------------------------------------: |
|        `BASIC_INSTRUCTION_INVALID`         |      It was not possible to read the note from the given basic instruction.      |
| `BASIC_INSTRUCTION_WITH_NON_WRITABLE_NOTE` | The string of the given basic instruction does not exist on the given tablature. |

## Method Instructions

### General

Failure reasons regarding [method instructions](../parser/README.md#method-instructions) in general:

|     Failure Reason Identifier     |                                  Description                                   |
| :-------------------------------: | :----------------------------------------------------------------------------: |
| `UNIDENTIFIED_METHOD_INSTRUCTION` |   It was not possible to identify a method instruction for the given alias.    |
|   `UNKNOWN_METHOD_INSTRUCTION`    | No method instruction implemented for the given method instruction identifier. |

### Footer

Failure reasons regarding the [footer instruction](../parser/README.md#method-instruction-footer):

|          Failure Reason Identifier           |                                Description                                 |
| :------------------------------------------: | :------------------------------------------------------------------------: |
|    `FOOTER_INSTRUCTION_WITHOUT_ARGUMENTS`    |       The method instruction `footer` was called with no arguments.        |
| `FOOTER_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS` |  The method instruction `footer` was called with more than one argument.   |
|   `FOOTER_INSTRUCTION_WITH_INVALID_FOOTER`   | The method instruction `footer` was called with an invalid footer message. |

### Header

Failure reasons regarding the [header instruction](../parser/README.md#method-instruction-header):

|          Failure Reason Identifier           |                                Description                                 |
| :------------------------------------------: | :------------------------------------------------------------------------: |
|    `HEADER_INSTRUCTION_WITHOUT_ARGUMENTS`    |       The method instruction `header` was called with no arguments.        |
| `HEADER_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS` |  The method instruction `header` was called with more than one argument.   |
|   `HEADER_INSTRUCTION_WITH_INVALID_HEADER`   | The method instruction `header` was called with an invalid header message. |

### Merge

Failure reasons regarding the [merge instruction](../parser/README.md#method-instruction-merge):

|              Failure Reason Identifier              |                                                       Description                                                       |
| :-------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------: |
|         `MERGE_INSTRUCTION_WITHOUT_TARGETS`         |                   The method instruction `merge` was called with no instructions to merge (targets).                    |
|    `MERGE_INSTRUCTION_WITH_UNMERGEABLE_TARGETS`     |                   The method instruction `merge` was called with unmergeable instructions (targets).                    |
| `MERGE_INSTRUCTION_TARGETS_WITH_NON_WRITABLE_NOTES` | The method instruction `merge` was called with a target instruction whose string does not exist on the given tablature. |
|  `MERGE_INSTRUCTION_TARGETS_WITH_CONCURRENT_NOTES`  |        The method instruction `merge` was called with multiple target instructions referring to the same string.        |

### Repeat

Failure reasons regarding the [repeat instruction](../parser/README.md#method-instruction-repeat):

|                Failure Reason Identifier                 |                                                                 Description                                                                  |
| :------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: |
|          `REPEAT_INSTRUCTION_WITHOUT_ARGUMENTS`          |                                        The method instruction `repeat` was called with no arguments.                                         |
|       `REPEAT_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS`       |                                   The method instruction `repeat` was called with more than one argument.                                    |
| `REPEAT_INSTRUCTION_WITH_INVALID_REPETITIONS_VALUE_TYPE` |          The method instruction `repeat` was called with an invalid value type for the number of repetitions. It must be a number.           |
|   `REPEAT_INSTRUCTION_WITH_INVALID_REPETITIONS_VALUE`    | The method instruction `repeat` was called with an invalid number value for the number of repetitions. It must be an integer greater than 0. |
|           `REPEAT_INSTRUCTION_WITHOUT_TARGETS`           |                             The method instruction `repeat` was called with no instructions to repeat (targets).                             |

### Spacing

Failure reasons regarding the [spacing instruction](../parser/README.md#method-instruction-spacing):

|               Failure Reason Identifier               |                                                                Description                                                                |
| :---------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|        `SPACING_INSTRUCTION_WITHOUT_ARGUMENTS`        |                                      The method instruction `spacing` was called with no arguments.                                       |
|     `SPACING_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS`     |                                 The method instruction `spacing` was called with more than one argument.                                  |
| `SPACING_INSTRUCTION_WITH_INVALID_SPACING_VALUE_TYPE` |          The method instruction `spacing` was called with an invalid value type for the new spacing value. It must be a number.           |
|   `SPACING_INSTRUCTION_WITH_INVALID_SPACING_VALUE`    | The method instruction `spacing` was called with an invalid number value for the new spacing value. It must be an integer greater than 0. |
