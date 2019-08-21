import { fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

import '../../../src/components/card-stack/card-stack.js';

import { collectionMock, collectionMock2 } from '../../mocks/collection.js';

describe('dc-stack component', () => {
  let el;
  let mock;

  const testNoCollectionMsg = () => {
    it('a "no valid collection" message is shown', () => {
      expect(el).shadowDom.to.equal('<div class="cards-stack"><p>No valid collection</p></div>');
    });
  };

  const testRenderCollection = () => {
    it('render the collection using dc-flashcard', () => {
      const cardsEl = el.shadowRoot.querySelectorAll('dc-flashcard');
      expect(cardsEl).to.have.lengthOf(mock.length);
      const renderedQuestions = [...cardsEl].map(elmt =>
        elmt.querySelector('[slot="question"]').innerHTML.trim(),
      );
      const mockQuestions = mock.map(card => card.question);
      expect(renderedQuestions).to.deep.equal(mockQuestions);
    });
  };

  describe('Given: no argument nor content', () => {
    beforeEach(async () => {
      el = await fixture('<dc-stack></dc-stack>');
    });

    testNoCollectionMsg();

    describe('When: an initial collection is given', () => {
      beforeEach(() => {
        mock = collectionMock;
        el.collection = mock;
      });

      testRenderCollection();

      describe('When: pop() is called', () => {
        beforeEach(() => {
          el.pop();
        });

        it('the last card is removed from the current deck', () => {
          expect(el)
            .to.have.property('currentDeck')
            .that.is.an('array')
            .that.deep.equal(mock.slice(0, -1));
        });

        it('the last flashcard is removed from the DOM', () => {
          expect(el.shadowRoot.querySelectorAll('dc-flashcard').length).to.equal(mock.length - 1);
          const lastFlashcardEl = el.shadowRoot
            .querySelector('.card-wrapper:last-child [slot="question"]')
            .innerHTML.trim();
          expect(lastFlashcardEl).to.equal(mock[mock.length - 2].question);
        });

        it(`the collection hasn't changed`, () => {
          expect(el.collection).to.deep.equal(mock);
        });

        describe(`When: there isn't any card left in the current deck`, () => {
          let emptyStackEventSpy;

          beforeEach(() => {
            emptyStackEventSpy = sinon.spy();
            el.addEventListener('empty-stack', emptyStackEventSpy);

            el.pop();
            el.pop();
          });

          it('a message is rendered', () => {
            expect(el.shadowRoot)
              .to.have.descendant('.empty-box > p')
              .that.have.text(
                'You finished this session! Click the reload button to review this collection again.',
              );
          });

          it('a reload button is rendered', () => {
            expect(el.shadowRoot).to.have.descendant('i.reload');
          });

          it('one "empty-stack" event is fired', () => {
            expect(emptyStackEventSpy.callCount).to.equal(1);
          });

          describe('When: click on the reload button', () => {
            let reloadFromCollectionEventSpy;

            beforeEach(() => {
              reloadFromCollectionEventSpy = sinon.spy();
              el.addEventListener('reload-collection', reloadFromCollectionEventSpy);
              el.shadowRoot.querySelector('i.reload').click();
            });

            it('one "empty-stack" event is fired ', () => {
              expect(reloadFromCollectionEventSpy.callCount).to.equal(1);
            });

            testRenderCollection();
          });
        });
      });

      describe('When: moveBack() is called', () => {
        beforeEach(() => {
          el.moveBack();
        });

        it('the last card is moved to the bottom of the deck', () => {
          const movedMock = [mock[mock.length - 1], ...mock.slice(0, -1)];
          expect(el)
            .to.have.property('currentDeck')
            .that.deep.equals(movedMock);

          const lastFlashcardEl = el.shadowRoot
            .querySelector('.card-wrapper:last-child [slot="question"]')
            .innerHTML.trim();
          expect(lastFlashcardEl).to.equal(movedMock[movedMock.length - 1].question);

          const firstFlashcardEl = el.shadowRoot
            .querySelector('.card-wrapper:first-child [slot="question"]')
            .innerHTML.trim();
          expect(firstFlashcardEl).to.equal(movedMock[0].question);
        });
      });

      describe('When: the first card is flipped and then moveBack is called', () => {
        let flippedCard;
        beforeEach(() => {
          flippedCard = el.shadowRoot.querySelector('.card-wrapper:last-child dc-flashcard');
          flippedCard.setAttribute('flipped', '');
          el.moveBack();
        });

        it(`the card that have been moved isn't flipped`, () => {
          expect(flippedCard).to.not.have.attribute('flipped');
          expect(el.shadowRoot)
            .to.have.descendant('.card-wrapper:first-child [slot="question"]')
            .that.not.have.attribute('flipped');
        });
      });

      describe('When: an new collection is given', () => {
        beforeEach(() => {
          mock = collectionMock2;
          el.collection = mock;
        });

        testRenderCollection();
      });
    });

    describe('When: an invalid collection is given', () => {
      beforeEach(() => {
        el.collection = 'bad';
      });

      testNoCollectionMsg();
    });

    describe('When: an empty collection is given', () => {
      beforeEach(() => {
        el.collection = [];
      });

      testNoCollectionMsg();
    });
  });
});
