import { fixture, expect } from '@open-wc/testing';

import '../../../src/components/flashcard/flashcard.js';

describe('dc-flashcard component', () => {
  describe('Given: no initial slot / light DOM', () => {
    let el;

    beforeEach(async () => {
      el = await fixture('<dc-flashcard></dc-flashcard>');
    });

    it('show an error message in "question"', async () => {
      // question slot fallback content
      const questionContent = el.shadowRoot.querySelectorAll('slot[name=question] > *');

      // Then: no new question slot in light DOM
      expect(el).lightDom.to.be.empty;
      //    And: default question is an error
      expect(questionContent[0]).to.have.class('error');
      //    And: there isn't anything else in the question slot
      expect(questionContent).to.have.lengthOf(1);
      // It’s recommended to always use .lengthOf instead of .length.
      // see https://www.chaijs.com/api/bdd/#method_lengthof
    });

    it('show an error message in "answer"', async () => {
      // answer slot fallback content
      const answerContent = el.shadowRoot.querySelectorAll('slot[name=answer] > *');

      // Then: no new answer slot in light DOM
      expect(el).lightDom.to.be.empty;
      //    And: default answer is an error
      expect(answerContent[0]).to.have.class('error');
      //    And: there isn't anything else in the answer slot
      expect(answerContent).to.have.lengthOf(1);
    });
  });

  describe('Given: no initial attribute', () => {
    let el;

    beforeEach(async () => {
      el = await fixture(`
        <dc-flashcard>
          <p slot="question">
            A question?
          </p>
          <p slot="answer">
            An answer!
          </p>
        </dc-flashcard>
      `);
    });

    const testNoRotation = () => {
      it('the flipped property is false', () => {
        expect(el).to.have.property('flipped').that.is.false;
      })

      it(`flashcard isn't rotated`, async () => {
        const flashcardStyle = getComputedStyle(el.shadowRoot.querySelector('.flashcard'));
        expect(flashcardStyle)
          .to.have.property('transform')
          .that.equals('none');
      });
    };

    testNoRotation();

    const testRotation = () => {
      it('the flipped property is true', () => {
        expect(el).to.have.property('flipped').that.is.true;
      })

      it('flashcard has been rotated by 180deg', async () => {
        const flashcardStyle = getComputedStyle(el.shadowRoot.querySelector('.flashcard'));
        expect(flashcardStyle).to.have.property('transform').that.equals('matrix(1, 0, 0, 1, 0, 0)');
      });
    };

    describe('When: the flipped attribute is added', () => {
      beforeEach(() => {
        el.setAttribute('flipped', '');
      })

      testRotation()
    });

    describe('When: the flip method is called', () => {
      beforeEach(() => {
        el.flip();
      })

      testRotation()
    });

    describe('When: the flip method is called twice', () => {
      beforeEach(() => {
        el.flip();
        el.flip();
      })

      testNoRotation()
    });

    describe('When: click on the card', () => {
      beforeEach(() => {
        el.click();
      })

      testRotation()
    });
  });
});
