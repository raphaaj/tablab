# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
# Test
npm test                    # run all tests
npx jest <pattern>          # run single test file, e.g. npx jest parser
npm run test:coverage       # tests + coverage report

# Lint & format
npm run lint                # ESLint (src + tests)
npm run lint:fix            # ESLint with auto-fix
npm run prettier:check      # check formatting
npm run prettier:write      # apply formatting

# Build
npm run build               # compile via Rollup → lib/
npm run api-docs            # generate TypeDoc API docs → api-docs/
```

## Architecture

Two usage paths, both centered on `Tab`:

**Path 1 — direct API:** instantiate `Tab`, call `writeNote`, `writeParallelNotes`, `writeHeader`, `writeFooter`, `addBlock`, `setSpacing`, then `format(blockLength)`.

**Path 2 — parser pipeline:** `Parser.parseAll(instructions)` → array of `ParsedInstruction` → `parsedInstruction.writeOnTab(tab)` for each → `tab.format(blockLength)`.

### `src/tab/`

- `TabElement` — base class with shared state (`numberOfStrings`, `spacing`, `spacingCharacter`, `sectionDivisionCharacter`) and abstract write methods.
- `TabBlock extends TabElement` — single renderable block; handles column layout, header/footer sections, and `format(blockLength)` output (returns `string[][]`).
- `Tab extends TabElement` — manages an array of `TabBlock`s; delegates all write operations to `currentBlock` (the last block); `addBlock()` creates a new block carrying current tab state.
- `Note` — value object: `(string: number, fret: string)`.

### `src/parser/`

- `Parser` — splits whitespace-separated instruction text. Recognizes two forms:
  - *Method instructions*: `alias(args){ targets }` — alias resolved via `methodInstructionAlias2IdentifierMap`.
  - *Basic instructions*: anything else (parsed as note `string-fret`).
- `ParsedInstruction` — holds parsed data + `instructionWriterProvider`; `writeOnTab(tab)` delegates to the provider.
- `ParsedMethodInstruction` — extends with `alias`, `identifier`, `args[]`, `targets[]`.

### `src/instruction-writer/`

- `BaseInstructionWriterFactory` (abstract) — implements `InstructionWriterProvider`; routes parsed instructions to concrete writers via `methodInstructionIdentifier2InstructionWriterBuilderMap`. Extend this to add custom method instructions.
- `InternalInstructionWriterFactory` — the default factory; wires all built-in method identifiers (`break`, `footer`, `header`, `merge`, `repeat`, `spacing`) to their writers.
- `instruction-writers/` — one class per instruction type (`NoteInstructionWriter`, `MergeInstructionWriter`, `RepeatInstructionWriter`, etc.) plus `BaseInvalidInstructionWriter` for parse/validation failures.
- `write-results/` — `BaseWriteResult` with `success` flag; `SuccessfulWriteResult` / `FailedWriteResult` (carries `failureReasonIdentifier` and `failureMessage`).
- `enums/` — `MethodInstruction` (built-in identifier strings), `InvalidInstructionReason`.

### `src/helpers/`

Stateless utilities: `EnclosuresHelper` (bracket matching), `StringHelper` (number detection, index search), `NumberHelper` (integer vs decimal classification).

## Build output

Rollup bundles `src/index.ts` into `lib/` as CJS, ESM, UMD, IIFE — each with a minified variant. Types are bundled separately via `rollup-plugin-dts` from the intermediate `lib/index.d.ts`.
