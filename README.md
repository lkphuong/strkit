# strkit

A small, zero-dependency TypeScript string utilities library. `strkit` provides
common string transformations and helpers (camelCase, snake_case, kebab-case,
deburring, escaping, padding, etc.) with full TypeScript types and declarations.

## Features

- Well-typed TypeScript API with declaration files
- Common string case converters: `camelCase`, `pascalCase`, `snakeCase`, `kebabCase`, `constantCase`
- Utility helpers: `deburr`, `escape`, `pad`, `trim`, `upperCase`, `lowerCase`, `reverseString`, and more
- Unicode-aware splitting and handling (emoji and extended scripts supported)

## Install

From npm (recommended):

```bash
npm install strkit
```

When working from this repository (development):

```bash
# install dependencies
npm install

# build
npm run build

# run the package (after build)
npm start

# run directly in TS for development
npm run dev
```

> Note: this project compiles TypeScript to `dist/` and emits declaration files (`dist/index.d.ts`).

## Quick usage

Importing in TypeScript / ESM:

```ts
import { camelCase, snakeCase, deburr } from "strkit";

console.log(camelCase("Hello WORLD")); // "helloWorld"
console.log(snakeCase("Hello World")); // "hello_world"
console.log(deburr("déjà vu")); // "deja vu"
```

Using CommonJS (Node):

```js
const { kebabCase, escape } = require("strkit");

console.log(kebabCase("Hello World")); // "hello-world"
console.log(escape("<div>&</div>")); // "&lt;div&gt;&amp;&lt;/div&gt;"
```

## API (high level)

Main exports live in `src/index.ts` and include (but are not limited to):

- `camelCase(str: string): string`
- `pascalCase(str: string): string`
- `snakeCase(str: string): string`
- `kebabCase(str: string): string`
- `constantCase(str: string): string`
- `deburr(str: string): string`
- `escape(str: string): string`
- `pad(str: string, length: number, chars?: string): string`

See the source for full JSDoc and examples: `src/index.ts`.

## Development

- Build: `npm run build` (runs `tsc` and emits `dist/`)
- Clean: `npm run clean` (removes `dist/`)
- Dev (fast-run): `npm run dev` (runs `ts-node --transpile-only src/index.ts`)

If you don't have `ts-node` or other dev tools installed globally, `npm install` will add them as devDependencies.

## Testing

There are no tests yet. A recommended minimal next step is to add a test runner (Jest / Vitest) and include a couple of unit tests for core functions like `camelCase` and `deburr`.

## Contributing

Contributions are welcome. A small suggested workflow:

1. Fork the repository
2. Create a feature branch
3. Add tests for any new behavior
4. Open a pull request with a clear description

Please run `npm run build` and ensure TypeScript compilation passes before submitting a PR.

## License

This project uses the ISC license (see `package.json`).

## Contact

If you have questions or ideas, open an issue on the repository.
