/**
 * Template tag without any effect
 * Only permits dev tools (like Prettier) to identify template strings as css
 * @example
 *  css`
 *    .title { color: red }
 *  `
 */
export function css(t) {
  return t
}

/**
 * Template tag without any effect
 * Only permits dev tools (like Prettier) to identify template strings as html
 * @example
 *  html`
 *    <div>Hello World!</div>
 *  `
 */
export function html(t) {
  return t
}
