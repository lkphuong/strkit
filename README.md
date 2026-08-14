# strkit-lib

[![npm version](https://img.shields.io/npm/v/strkit-lib.svg)](https://www.npmjs.com/package/strkit-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)

A comprehensive, zero-dependency TypeScript string utilities library designed for modern applications. **strkit-lib** provides a complete suite of string transformations, case converters, and advanced utilities with full TypeScript type safety and Unicode support.

## ✨ Features

- **Zero Dependencies** - Lightweight and production-ready with no external dependencies
- **Full TypeScript Support** - Complete type definitions and declarations included
- **Unicode-Aware** - Properly handles emoji, extended scripts, and diacritical marks
- **Comprehensive API** - 20+ utility functions covering all common string operations
- **Case Converters** - `camelCase`, `PascalCase`, `snake_case`, `kebab-case`, `CONSTANT_CASE`, and more
- **Advanced Utilities** - Deburring, escaping, padding, trimming, and string manipulation
- **Object Key Transformation** - Recursively convert object keys between naming conventions
- **Vietnamese Lunar Calendar** - Convert between solar (Gregorian) and lunar (âm lịch) dates
- **Production-Ready** - Battle-tested and optimized for performance

## 📦 Installation

Install via npm:

```bash
npm install strkit-lib
```

Or using yarn:

```bash
yarn add strkit-lib
```

Or using pnpm:

```bash
pnpm add strkit-lib
```

## 📖 API

### Case conversion

| Function | Description |
| --- | --- |
| `capitalize(str)` | Uppercases the first character, lowercases the rest. |
| `camelCase(str)` | Converts to `camelCase`. |
| `pascalCase(str)` | Converts to `PascalCase`. |
| `snakeCase(str)` | Converts to `snake_case`. |
| `kebabCase(str)` | Converts to `kebab-case`. |
| `constantCase(str)` | Converts to `CONSTANT_CASE`. |
| `startCase(str)` | Converts to `Start Case`. |
| `lowerCase(str)` | Converts to `lower case` words. |
| `upperCase(str)` | Converts to `UPPER CASE` words. |
| `lowerFirst(str)` | Lowercases only the first character. |
| `upperFirst(str)` | Uppercases only the first character. |
| `words(str)` | Splits a string into word-like segments. |

### String utilities

| Function | Description |
| --- | --- |
| `deburr(str)` | Removes diacritics/accents (e.g. `"déjà vu"` → `"deja vu"`). |
| `escape(str)` | Escapes HTML special characters (`&`, `<`, `>`, `"`, `'`). |
| `pad(str, length, chars?)` | Pads both sides of a string to a target length. |
| `trim(str, chars?)` | Trims characters from both ends. |
| `trimStart(str, chars?)` | Trims characters from the start. |
| `trimEnd(str, chars?)` | Trims characters from the end. |
| `reverseString(str)` | Reverses a string (Unicode-safe). |
| `sprintf(format, ...args)` | `sprintf`-style formatting (`%s`, `%d`, `%v`). |

### Object key transformation

| Function | Description |
| --- | --- |
| `toCamelCase(value)` | Recursively converts object/array keys to `camelCase`. |
| `toSnakeCase(value)` | Recursively converts object/array keys to `snake_case`. |
| `convertKeysWithBoth(value)` | Recursively adds both `camelCase` and `snake_case` key variants. |

### Lunar calendar

| Function | Description |
| --- | --- |
| `convertSolarToLunar(date, timeZone?)` | Converts a solar (Gregorian) date to a lunar (âm lịch) date. |
| `convertLunarToSolar(lunar, timeZone?)` | Converts a lunar (âm lịch) date back to a solar date. |

## 🗓️ Lunar Calendar

Convert between solar (Gregorian) dates and Vietnamese lunar calendar (âm lịch) dates,
following the standard rules used in Vietnam (GMT+7, 105° East meridian): lunar months
start on the astronomical new moon, and leap months are inserted based on the winter
solstice and solar terms.

```ts
import { convertSolarToLunar, convertLunarToSolar } from "strkit-lib";

convertSolarToLunar(new Date(2024, 1, 10));
// { day: 1, month: 1, year: 2024, isLeapMonth: false }  -- Tết Giáp Thìn

convertLunarToSolar({ day: 1, month: 1, year: 2024, isLeapMonth: false });
// 2024-02-10
```

## Contact

If you have questions or ideas, open an issue on the repository.
