import { fixture, expect, chai, nextFrame } from '@open-wc/testing';

import { chaiDom } from '../../utils/chai-dom/chai-dom.js';

chai.use(chaiDom);

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
    const renderedQuestions = [...cardsEl].map(elmt => elmt.querySelector('[slot="question"]').innerHTML.trim())
    const mockQuestions = this.mock.map(card => card.question);
    expect(renderedQuestions).to.deep.equal(mockQuestions);
  });
};

describe('dc-stack component', function() {

  describe('Given: no argument nor content', function () {

    beforeEach(async function() {
      this.el = await fixture('<dc-stack></dc-stack');
    });

    testNoCollectionMsg();

    describe('When: an initial collection is given', function() {

      beforeEach(function() {
        this.mock = collectionMock;
        this.el.collection = this.mock;
      });

      testRenderCollection();

      describe('When: pop() is called', function() {
        beforeEach(async function() {
          this.popped = this.el.pop();
          await nextFrame();
        })

        it('the last card is removed from the current deck', function(){
          expect(this.el).to.have.property('currentDeck').that.is.an('array').that.deep.equal(this.mock.slice(0, -1));
        });

        it('the last flashcard is removed from the DOM', function(){
          expect(this.el.shadowRoot.querySelectorAll('dc-flashcard').length).to.equal(this.mock.length - 1);
          const lastFlashcardEl = this.el.shadowRoot.querySelector('.card-wrapper:last-child [slot="question"]').innerHTML.trim();
          expect(lastFlashcardEl).to.equal(this.mock[this.mock.length - 2].question);
        });
      });

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
