import { html, fixture, expect, chai, aTimeout } from '@open-wc/testing';

import { chaiDom } from '../../utils/chai-dom/chai-dom.js';

chai.use(chaiDom);

import '../../../src/components/card-stack/card-stack.js';

const collectionMock = [
  {
    question: 'foo',
    answer: '<ul><li>bar</li><li>baz</li></ul>'
  },
  {
    question: '<p>foo p</p>',
    answer: '<div>bar</bar>'
  },
  {
    question: 'Foo',
    answer: 'bar'
  }
];

const collectionMock2 = [
  {
    question: 'lorem',
    answer: '<ul><li>ipsum</li><li>lorem</li></ul>'
  },
  {
    question: '<p>lorem p</p>',
    answer: '<div>impsum</bar>'
  },
  {
    question: 'lorem',
    answer: 'ipsum'
  }
];

describe.only('dc-stack component', () => {

  let mock, el;

  function testNoCollectionMsg() {
    it('a "no valid collection" message is shown', () => {
      expect(el).shadowDom.to.equal('<div class="cards-stack"><p>No valid collection</p></div>');
    });
  };

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
      expect(cardsEl).to.have.lengthOf(mock.length);
      for (let i = 0; i < mock.length; i++) {
        const questionSlotContent = cardsEl[i].querySelector('[slot="question"]').innerHTML.trim();
        expect(questionSlotContent, `dc-card ${i}`).to.equals(mock[i].question);
      }
    });
  };

  describe('Given: no argument nor content', () => {
    beforeEach(async () => {
      el = await fixture('<dc-stack></dc-stack');
    });

    testNoCollectionMsg();

    describe('When: an initial collection is given', () => {

      beforeEach(() => {
        mock = collectionMock;
        el.collection = mock;
      });

      testRenderCollection();

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
      beforeEach(function() {
        el.collection = [];
      });

      testNoCollectionMsg();
    });
  });
});
