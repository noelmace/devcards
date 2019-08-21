/**
 * Returns a promise which resolves as soon as
 * requested element becomes available.
 * @param {string} tag
 * @returns {Promise<HTMLElement>}
 *
 * @copyright 2018 Michał Pietraszko
 * @license MIT
 * @see {@link https://github.com/pietmichal/how-to-test-web-component/blob/9d6d013/src/test-utils.js#L41-L58}
 */
export const waitForComponentToRender = async tag =>
  new Promise(resolve => {
    function requestComponent() {
      const element = document.querySelector(tag);
      if (element) {
        resolve(element);
      } else {
        window.requestAnimationFrame(requestComponent);
      }
    }
    requestComponent();
  });

/**
 * Resolves after requestAnimationFrame.
 *
 * @example
 * await nextFrame();
 *
 * @returns {Promise<void>} Promise that resolved after requestAnimationFrame
 *
 * @copright 2018 open-wc
 * @license MIT
 * @see {@link https://github.com/open-wc/open-wc/blob/f21d435/packages/testing-helpers/src/helpers.js#L48-L58}
 * @description
 *  This is basically the only thing
 *  [elementUpdated]{@link https://github.com/open-wc/open-wc/blob/f21d435/packages/testing-helpers/src/elementUpdated.js#L35-L37}
 *  does with vanilla web components in open-wc fixture.
 */
export function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

/**
 * Wait for component to be available (defined plus one frame)
 * Use after the element have been added to the DOM
 *
 * Replace {@link waitForComponentToRender}
 * inspired by [Jenna Salau]{@link https://twitter.com/jenna_salau}
 *
 * @example
 * const tagName = 'my-component';
 * el = document.createElement(tagName);
 * document.body.appendChild(el);
 * return waitForComponent(tagName)
 *
 * @param {string} tag WC tag name
 * @returns {Promise<HTMLElement>} Promise that resolved after WC is defined & requestAnimationFrame
 */
export const waitForComponent = async tag => {
  await customElements.whenDefined(tag);
  await nextFrame();
  return document.querySelector(tag);
};
