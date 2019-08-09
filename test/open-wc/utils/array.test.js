import { expect } from '@open-wc/testing';

import { backAndForth } from '../../../src/utils/array.js';

describe('backAndForth generator', () => {

  let array, length, gen, run;

  before(() => {
    length = Math.floor(Math.random()*40);
    array = [...Array(length)].map(e=>Math.floor(Math.random()*length));
    gen = backAndForth(array);
  })

  beforeEach(() => {
    run = array.map(() => gen.next().value);
  });

  describe('When: next is called X time', () => {
    it('(x=length) gives the elements of the array in reverse order' , () => {
      expect(run).to.deep.equal(array.reverse());
    })

    it('(x=2length) gives the elements of the array in order', () => {
      expect(run).to.deep.equal(array);
    })

    it('(x=3length) gives the elements of the array in reverse order again' , () => {
      expect(run).to.deep.equal(array.reverse());
    })
  })
});
