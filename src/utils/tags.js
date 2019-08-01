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
  return strings.reduce((rslt, str, i) => `${rslt}${keys[i]}`)
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
export function html(strings, ...keys) {
  return strings.reduce((rslt, str, i) => `${rslt}${keys[i]}`)
}
