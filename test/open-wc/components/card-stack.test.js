import { fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

import '../../../src/components/card-stack/card-stack.js';

import { collectionMock, collectionMock2 } from '../../mocks/collection.js';

function testNoCollectionMsg() {
  it('a "no valid collection" message is shown', function() {
    expect(this.el).shadowDom.to.equal('<div class="cards-stack"><p>No valid collection</p></div>');
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
  it('render the collection using dc-flashcard', function() {
    const cardsEl = this.el.shadowRoot.querySelectorAll('dc-flashcard');
    expect(cardsEl).to.have.lengthOf(this.mock.length);
    const renderedQuestions = [...cardsEl].map(elmt => elmt.querySelector('[slot="question"]').innerHTML.trim());
    const mockQuestions = this.mock.map(card => card.question);
    expect(renderedQuestions).to.deep.equal(mockQuestions);
  });
}

describe('dc-stack component', function() {
  describe('Given: no argument nor content', function() {
    beforeEach(async function() {
      this.el = await fixture('<dc-stack></dc-stack>');
    });

    testNoCollectionMsg();

    describe('When: an initial collection is given', function() {
      beforeEach(function() {
        this.mock = collectionMock;
        this.el.collection = this.mock;
      });

      testRenderCollection();

      describe('When: pop() is called', function() {
        beforeEach(function() {
          this.popped = this.el.pop();
        });

        it('the last card is removed from the current deck', function() {
          expect(this.el)
            .to.have.property('currentDeck')
            .that.is.an('array')
            .that.deep.equal(this.mock.slice(0, -1));
        });

        it('the last flashcard is removed from the DOM', function() {
          expect(this.el.shadowRoot.querySelectorAll('dc-flashcard').length).to.equal(this.mock.length - 1);
          const lastFlashcardEl = this.el.shadowRoot
            .querySelector('.card-wrapper:last-child [slot="question"]')
            .innerHTML.trim();
          expect(lastFlashcardEl).to.equal(this.mock[this.mock.length - 2].question);
        });

        it(`the collection hasn't changed`, function() {
          expect(this.el.collection).to.deep.equal(this.mock);
        });

        describe(`When: there isn't any card left in the current deck`, () => {
          beforeEach(function() {
            this.emptyStackEventSpy = sinon.spy();
            this.el.addEventListener('empty-stack', this.emptyStackEventSpy);

            this.el.pop();
            this.el.pop();
          });

          it('a message is rendered', function() {
            expect(this.el.shadowRoot)
              .to.have.descendant('.empty-box > p')
              .that.have.text('You finished this session! Click the reload button to review this collection again.');
          });

          it('a reload button is rendered', function() {
            expect(this.el.shadowRoot)
              .to.have.descendant('i.reload');
          });

          it('one "empty-stack" event is fired', function() {
            expect(this.emptyStackEventSpy.callCount).to.equal(1)
          })

          describe('When: click on the reload button', function() {
            beforeEach(function() {
              this.reloadFromCollectionEventSpy = sinon.spy()
              this.el.addEventListener('reload-collection', this.reloadFromCollectionEventSpy);
              this.el.shadowRoot.querySelector('i.reload').click()
            })

            it('one "empty-stack" event is fired ', function() {
              expect(this.reloadFromCollectionEventSpy.callCount).to.equal(1)
            })

            testRenderCollection()
          })

        });
      });

      describe('When: moveBack() is called', function() {
        beforeEach(function() {
          this.el.moveBack();
        });

        it('the last card is moved to the bottom of the deck', function() {
          const movedMock = [this.mock[this.mock.length - 1], ...this.mock.slice(0, -1)]
          expect(this.el).to.have.property('currentDeck').that.deep.equals(movedMock)

          const lastFlashcardEl = this.el.shadowRoot
            .querySelector('.card-wrapper:last-child [slot="question"]')
            .innerHTML.trim();
          expect(lastFlashcardEl).to.equal(movedMock[movedMock.length - 1].question);

          const firstFlashcardEl = this.el.shadowRoot
            .querySelector('.card-wrapper:first-child [slot="question"]')
            .innerHTML.trim();
          expect(firstFlashcardEl).to.equal(movedMock[0].question);
        })
      });

      describe('When: the first card is flipped and then moveBack is called', function() {
        beforeEach(function() {
          this.flippedCard = this.el.shadowRoot.querySelector('.card-wrapper:last-child dc-flashcard');
          this.flippedCard.setAttribute('flipped', '');
          this.el.moveBack();
        })

        it(`the card that have been moved isn't flipped`, function() {
          expect(this.flippedCard).to.not.have.attribute('flipped');
          expect(this.el.shadowRoot).to.have.descendant('.card-wrapper:first-child [slot="question"]').that.not.have.attribute('flipped');
        });
      })

      describe('When: an new collection is given', function() {
        beforeEach(function() {
          this.mock = collectionMock2;
          this.el.collection = this.mock;
        });

        testRenderCollection();
      });
    });

    describe('When: an invalid collection is given', function() {
      beforeEach(function() {
        this.el.collection = 'bad';
      });

      testNoCollectionMsg();
    });

    describe('When: an empty collection is given', function() {
      beforeEach(function() {
        this.el.collection = [];
      });

      testNoCollectionMsg();
    });
  });
});
