import { fixture, expect, aTimeout } from '@open-wc/testing';

import '../../../src/components/loader/loader.js';

describe('deck-loader component', () => {
  let el;

  const testPause = () => {
    it(`animation isn't running`, () => {
      expect(el.animationIntervalId).to.not.exist;
    });

    it(`property paused is true`, () => {
      expect(el).to.have.property('paused').that.is.true;
    });
  };

  const testNotPaused = () => {
    it('animation is running', () => {
      expect(el)
        .to.have.property('animationIntervalId')
        .that.is.a('number');
    });

    it(`isn't paused`, () => {
      expect(el).to.have.property('paused').that.is.false;
    });
  };

  describe('Given: no attribute nor content was provided', () => {
    beforeEach(async () => {
      el = await fixture('<deck-loader></deck-loader>');
    });

    it('default animation interval is .5s', () => {
      expect(el)
        .to.have.property('interval')
        .that.equals(500);
    });

    testNotPaused();

    describe('When: attribute paused is added', () => {
      beforeEach(() => {
        el.setAttribute('paused', '');
      });

      testPause();
    });
  });

  describe('Given: an interval of 200ms', () => {
    const interval = 200;

    beforeEach(async () => {
      el = await fixture(`<deck-loader interval=${interval}></deck-loader>`);
    });

    describe('When: we wait for "interval" + 50ms', () => {
      beforeEach(async () => {
        await aTimeout(interval + 50);
      });

      it('last card be repositionned by an animation', () => {
        const lastCardStyle = getComputedStyle(el.shadowRoot.querySelector('.card:last-child'));

        expect(lastCardStyle)
          .to.have.property('transform')
          .that.matches(/^matrix\(/);
      });

      it(`penultimate card shouldn't have any animation`, () => {
        const lastCardStyle = getComputedStyle(
          el.shadowRoot.querySelector('.card:nth-last-child(2)'),
        );

        expect(lastCardStyle)
          .to.have.property('transform')
          .that.equals('none');
      });
    });
  });

  describe('Given: interval set to 2s', () => {
    beforeEach(async () => {
      el = await fixture('<deck-loader interval="2000"></deck-loader>');
    });

    it('property interval is 2000', () => {
      expect(el)
        .to.have.property('interval')
        .that.equals(2000);
    });
  });

  describe('Given: animation is paused', () => {
    beforeEach(async () => {
      el = await fixture('<deck-loader paused></deck-loader>');
    });

    testPause();

    describe('When: attribute paused is removed', () => {
      beforeEach(() => {
        el.removeAttribute('paused');
      });

      testNotPaused();
    });
  });
});
