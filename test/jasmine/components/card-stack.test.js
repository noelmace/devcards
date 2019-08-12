import { waitForComponent } from '../../utils/rendering.js';

import '../../../src/components/card-stack/card-stack.js';

const collectionMock = [
  {
    question: 'fooo',
    answer: '<ul><li>bar</li><li>baz</li></ul>'
  },
  {
    question: '<p>foo p</p>',
    answer: '<div>bar</div>'
  },
  {
    question: 'Foo',
    answer: '<div>bar</div>'
  }
];

const collectionMock2 = [
  {
    question: 'lorem',
    answer: '<ul><li>ipsum</li><li>lorem</li></ul>'
  },
  {
    question: '<p>lorem p</p>',
    answer: '<div>impsum</div>'
  },
  {
    question: 'lorem',
    answer: 'ipsum'
  }
];

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
      const renderedQuestions = [...cardsEl].map(elmt => elmt.querySelector('[slot="question"]').innerHTML.trim())
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
          const lastFlashcardEl = el.shadowRoot.querySelector('.card-wrapper:last-child [slot="question"]').innerHTML.trim();
          expect(lastFlashcardEl).toEqual(mock[mock.length - 2].question);
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
