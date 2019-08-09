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

function testNoCollectionMsg() {
  it('a "no valid collection" message is shown', function() {
    expect(this.el).shadowDom.to.equal('<div class="cards-stack"><p>No valid collection</p></div>');
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
  it('render the collection using dc-flashcard', function() {
    const cardsEl = this.el.shadowRoot.querySelectorAll('dc-flashcard');
    expect(cardsEl).to.have.lengthOf(this.mock.length);
    for (let i = 0; i < this.mock.length; i++) {
      const questionSlotContent = cardsEl[i].querySelector('[slot="question"]').innerHTML.trim();
      expect(questionSlotContent, `dc-card ${i}`).to.equals(this.mock[i].question);
    }
  });
};

describe('dc-stack component', () => {

  describe('Given: no argument nor content', function () {
    beforeEach(async function() {
      this.el = await fixture('<dc-stack></dc-stack');
    });

    testNoCollectionMsg();

    describe('When: an initial collection is given', () => {

      beforeEach(function() {
        this.mock = collectionMock;
        this.el.collection = this.mock;
      });

      testRenderCollection();

      describe('When: an new collection is given', () => {
        beforeEach(function() {
          this.mock = collectionMock2;
          this.el.collection = this.mock;
        });

        testRenderCollection();
      });
    });

    describe('When: an invalid collection is given', () => {
      beforeEach(function() {
        this.el.collection = 'bad';
      });

      testNoCollectionMsg();
    });

    describe('When: an empty collection is given', () => {
      beforeEach(function() {
        this.el.collection = [];
      });

      testNoCollectionMsg();
    });
  });
});
