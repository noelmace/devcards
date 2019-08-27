# Typing w/o transpilation

## Custom types

1. use `@typedef` _or a TypeScript file_ in order to define a type
2. import it using ``@typedef { import(<js or ts file>)``

```javascript
/** @typedef { import('../flashcard/flashcard').Card } Card */
```

## in VS Code

```json
"javascript.implicitProjectConfig.checkJs": true
```

or add `// @ts-check`

or (all files) https://github.com/microsoft/vscode/issues/13953#issuecomment-508839174

## generate d.ts files

inspired by Open WC
- https://github.com/open-wc/open-wc/blob/master/package.json#L7
- https://github.com/open-wc/open-wc/blob/master/package.json#L60

will probably end up only in the next version
https://github.com/microsoft/TypeScript/pull/32372

## ressources

- https://fettblog.eu/typescript-jsdoc-superpowers/
- https://jsdoc.app
- https://medium.com/@trukrs/type-safe-javascript-with-jsdoc-7a2a63209b76
- https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc

## issues

- https://github.com/Microsoft/TypeScript/issues/10642
