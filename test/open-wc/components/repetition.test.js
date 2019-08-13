import { fixture, expect, elementUpdated } from '@open-wc/testing';

// todo: stub dc-stack
import '../../../src/components/repetition/repetition.js';
import { mockResponse200, mockResponse404 } from '../../utils/http.js';

import { collectionMock } from '../../mocks/collection.js';
import sinon from 'sinon';

/**
 * @param {RegExp} urlPattern
 */
function testFetch(urlPattern) {
  it('data is fetched', function() {
    expect(this.fetchStub).to.have.been.calledWithMatch({ url: sinon.match(urlPattern) });
  });
}

function testCardsRendering(collection) {
  it('cards are rendered into the first box', function() {
    expect(this.el.shadowRoot)
      .to.have.descendant('.stack-0')
      .which.has.property('collection')
      .that.deep.equals(collection);
  });
}

describe('dc-repetition component', function() {

  beforeEach(function() {
    this.fetchStub = sinon.stub(window, 'fetch');
    this.mockCollectionName = 'foo';
  });

  describe('Given: no argument nor content', function() {
    beforeEach(async function() {
      this.el = await fixture('<dc-repetition></dc-repetition>');
    });

    it(`asn't any collection by default`, function() {
      expect(this.el.collection).to.be.null;
      expect(this.el.shadowRoot)
        .to.have.descendant('dc-stack')
        .that.has.property('collection').which.is.null;
    });

    describe('When: a valid collection name is given', function() {
      beforeEach(function() {
        // don't use stub.resolves or stub.returns here, because the same Response instance would be used every time
        // which could leads to a "Failed to execute 'json' on 'Response': body stream is locked" error
        // FYI, doing so, you could also use before instead of beforeEach, but only if you don't need to count calls or
        // verify an abscence of call
        // but this doesn't make a real difference with performance, so, favor beforeEach by default when mocking fetch
        this.fetchStub.callsFake(mockResponse200(collectionMock));
      });

      beforeEach(async function() {
        this.el.setAttribute('collection', 'foo');
        await elementUpdated(this.el);
      });

      testFetch(/\/data\/foo\.json$/);

      testCardsRendering(collectionMock);

      describe('When: a button is clicked', function() {
        beforeEach(function() {
          this.firstStackEl = this.el.shadowRoot.querySelector('.stack-0');
          sinon.spy(this.firstStackEl, 'pop');
          sinon.spy(this.firstStackEl, 'moveBack');
        });

        describe('"ok" button', function() {
          beforeEach(function() {
            this.el.shadowRoot.querySelector('.action-ok').click();
          });

          it('DeckStack.pop() has been called on the first stack', function() {
            expect(this.firstStackEl.pop).to.have.been.calledOnce;
          });

          it('first card is moved to the next box', function() {
            expect(this.el)
              .to.have.property('boxes')
              .that.deep.equals([collectionMock.slice(0, -1), [collectionMock[collectionMock.length - 1]], []]);
          });
        });

        describe('"nok" button', function() {
          beforeEach(function() {
            this.el.shadowRoot.querySelector('.action-nok').click();
          });

          it('DeckStack.mockBack() has been called on the first stack', function() {
            expect(this.firstStackEl.moveBack).to.have.been.calledOnce;
          });
        });
      });
    });

    describe('When: an invalid collection name is given', function() {
      beforeEach(function() {
        this.fetchStub.callsFake(mockResponse404);
      });

      beforeEach(async function() {
        this.el.setAttribute('collection', this.mockCollectionName);
        await elementUpdated(this.el);
      });

      testFetch(/\/data\/foo\.json$/);

      it('an error message is shown', function() {
        expect(this.el.shadowRoot).to.have.descendant('.errors-container').that.is.visible.and.displayed;
        expect(this.el.shadowRoot)
          // see https://github.com/nathanboktae/chai-dom/issues/30#issuecomment-372759090
          // in order to understand why semantic-dom-diff & chai-dom are so different
          .to.have.descendant('.errors-container > p')
          .which.has.text(`No flashcard could be found for the ${this.mockCollectionName} collection.`);
      });
    });

    describe('Given: collection attribute is set to a falsy value', function() {
      beforeEach(async function() {
        this.el.setAttribute('collection', '');
        await elementUpdated(this.el);
      });

      it('no fetch', function() {
        expect(this.fetchStub).to.not.have.been.called;
      });

      testCardsRendering(null);
    });
  });

  describe('Given: collection attribute is set to a truthy string', function() {
    beforeEach(function() {
      this.fetchStub.callsFake(mockResponse200(collectionMock));
    });

    beforeEach(async function() {
      this.el = await fixture(`<dc-repetition collection="${this.mockCollectionName}"></dc-repetition>`);
    });

    testFetch(/\/data\/foo\.json$/);

    testCardsRendering(collectionMock);
  });

  afterEach(function() {
    this.fetchStub.restore();
  });
});
