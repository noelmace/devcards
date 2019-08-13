import { waitForComponent } from '../../utils/rendering.js';

import '../../../src/components/card-stack/card-stack.js';

import { collectionMock, collectionMock2 } from '../../mocks/collection.js';

const TAG_NAME = 'dc-stack';

describe('dc-stack component', () => {
  let el, mock;

  function testNoCollectionMsg() {
    it('a "no valid collection" message is shown', () => {
      expect(el.shadowRoot.querySelector('.cards-stack').innerHTML.trim()).toBe('<p>No valid collection</p>');
    });
  }

  /**
   * Use the this context for mocks
   * therefore, it needs that all beforeEach use anonymous functions instead of arrow functions
   * See https://github.com/mochajs/mocha/wiki/Shared-Behaviours
   * TODO: see if we can use context in a more modern way
   * See https://github.com/mochajs/mocha/issues/1856
   */
  function testRenderCollection() {
    it('render the collection using dc-flashcard', () => {
      const cardsEl = el.shadowRoot.querySelectorAll('dc-flashcard');
      expect(cardsEl.length).toBe(mock.length);
      const renderedQuestions = [...cardsEl].map(elmt => elmt.querySelector('[slot="question"]').innerHTML.trim());
      const mockQuestions = mock.map(card => card.question);
      expect(renderedQuestions).toEqual(mockQuestions);
    });
  }

  describe('Given: no argument nor content', () => {
    beforeEach(async () => {
      el = document.createElement(TAG_NAME);
      document.body.appendChild(el);
      await waitForComponent(TAG_NAME);
    });

    testNoCollectionMsg();

    describe('When: an initial collection is given', () => {
      beforeEach(() => {
        mock = collectionMock;
        el.collection = mock;
      });

      testRenderCollection();

      describe('When: pop() is called', () => {
        beforeEach(async () => {
          el.pop();
          await waitForComponent(TAG_NAME);
        });

        it('the last card is removed from the current deck', () => {
          expect(el.currentDeck).toEqual(mock.slice(0, -1));
        });

        it('the last flashcard is removed from the DOM', () => {
          expect(el.shadowRoot.querySelectorAll('dc-flashcard').length).toBe(mock.length - 1);
          const lastFlashcardEl = el.shadowRoot
            .querySelector('.card-wrapper:last-child [slot="question"]')
            .innerHTML.trim();
          expect(lastFlashcardEl).toEqual(mock[mock.length - 2].question);
        });

        it(`the collection hasn't changed`, function() {
          expect(el.collection).toEqual(mock);
        });

        describe(`When: there isn't any card left in the current deck`, () => {
          let emptyStackEventSpy;
          beforeEach(() => {
            emptyStackEventSpy = jasmine.createSpy('empty-stack event');
            el.addEventListener('empty-stack', emptyStackEventSpy);

            el.pop();
            el.pop();
          });

          it('a message is rendered', () => {
            expect(el.shadowRoot.querySelector('.empty-box > p').innerText.trim())
              .toEqual('You finished this session! Click the reload button to review this collection again.');
          });

          it('a reload button is rendered', () => {
            expect(el.shadowRoot.querySelector('i.reload'))
              .not.toBeNull();
          });

          it('one "empty-stack" event is fired', () => {
            expect(emptyStackEventSpy).toHaveBeenCalledTimes(1);
          })

          describe('When: click on the reload button', () => {
            let reloadFromCollectionEventSpy;

            beforeEach(() => {
              reloadFromCollectionEventSpy = jasmine.createSpy()
              el.addEventListener('reload-collection', reloadFromCollectionEventSpy);
              el.shadowRoot.querySelector('i.reload').click()
            })

            it('one "empty-stack" event is fired ', () => {
              expect(reloadFromCollectionEventSpy).toHaveBeenCalledTimes(1)
            })

            testRenderCollection()
          })

        });
      });

      describe('When: moveBack() is called', () => {
        beforeEach(() => {
          el.moveBack();
        });

        it('the last card is moved to the bottom of the deck', () => {
          const movedMock = [mock[mock.length - 1], ...mock.slice(0, -1)];
          expect(el.currentDeck).toEqual(movedMock);

          const lastFlashcardEl = el.shadowRoot
            .querySelector('.card-wrapper:last-child [slot="question"]')
            .innerHTML.trim();
          expect(lastFlashcardEl).toEqual(movedMock[movedMock.length - 1].question);

          const firstFlashcardEl = el.shadowRoot
            .querySelector('.card-wrapper:first-child [slot="question"]')
            .innerHTML.trim();
          expect(firstFlashcardEl).toEqual(movedMock[0].question);
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
          expect(flippedCard.hasAttribute('flipped')).toBe(false);
          expect(
            el.shadowRoot.querySelector('.card-wrapper:first-child [slot="question"]').hasAttribute('flipped')
          ).toBe(false);
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
