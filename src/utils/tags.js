/** @module */

/**
 * Identity template tag
 * permits dev tools (like Prettier) to identify template strings as css
 * @deprecated Only for teaching purpose! DON'T USE IN PRODUCTION!
 * @example
 *  css`
 *    .title { color: red }
 *  `
 */
export function css(strings, ...keys) {
  let acc = '';
  const smallerLength = Math.min(strings.length, keys.length);
  for (let i = 0; i < smallerLength; i++) {
    acc += strings[i] + keys[i];
  }
  if (strings.length > keys.length) {
    return acc + strings[strings.length - 1];
  } else if (keys.length > strings.length) {
    return acc + keys[keys.length - 1];
  }
  return acc;
}

/**
 * Identity template tag
 * permits dev tools (like Prettier) to identify template strings as html
 * @deprecated Only for teaching purpose! DON'T USE IN PRODUCTION!
 * @example
 *  html`
 *    <div>Hello World!</div>
 *  `
 */
export { css as html };
