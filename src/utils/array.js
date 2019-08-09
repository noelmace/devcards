/** @module */

/**
 * Permits to infinitely iterate over an Array, back and forth, starting from its last element
 * @type {Generator}
 * @param {Array} array - the array to iterate on
 */
export function* backAndForth(array) {
  let step = array.length - 1;
  let direction = -1;
  let previousDirection = 0;

  while (true) {
    yield array[step];
    step += direction;
    // TODO: test w/ array changes
    if (step === 0 || step === array.length - 1) {
      if (direction !== 0) {
        previousDirection = direction;
        direction = 0;
      } else {
        direction = -previousDirection;
      }
    }
  }
}
