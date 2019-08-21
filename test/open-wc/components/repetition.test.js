import { fixture, expect, elementUpdated } from '@open-wc/testing';

import '../../../src/components/repetition/repetition.js';
import { mockResponse200, mockResponse404 } from '../../utils/http.js';

import { collectionMock } from '../../mocks/collection.js';
import sinon from 'sinon';

describe('dc-repetition component', () => {
  let fetchStub, mockCollectionName, el;

  beforeEach(() => {
    fetchStub = sinon.stub(window, 'fetch');
    mockCollectionName = 'foo';
  });

  /**
   * @param {RegExp} urlPattern
   */
  const testFetch = urlPattern => {
    it('data is fetched', () => {
      expect(fetchStub).to.have.been.calledWithMatch({ url: sinon.match(urlPattern) });
    });
  };

  const testCardsRendering = collection => {
    it('cards are rendered into the first box', () => {
      expect(el.shadowRoot)
        .to.have.descendant('.stack-0')
        .which.has.property('collection')
        .that.deep.equals(collection);
    });
  };

  describe('Given: no argument nor content', () => {
    beforeEach(async () => {
      el = await fixture('<dc-repetition></dc-repetition>');
    });

    it(`asn't any collection by default`, () => {
      expect(el.collection).to.be.null;
      expect(el.shadowRoot)
        .to.have.descendant('dc-stack')
        .that.has.property('collection').which.is.null;
    });

    describe('When: a valid collection name is given', () => {
      beforeEach(() => {
        // don't use stub.resolves or stub.returns here, because the same Response instance would be used every time
        // which could leads to a "Failed to execute 'json' on 'Response': body stream is locked" error
        // FYI, doing so, you could also use before instead of beforeEach, but only if you don't need to count calls or
        // verify an abscence of call
        // but  doesn't make a real difference with performance, so, favor beforeEach by default when mocking fetch
        fetchStub.callsFake(mockResponse200(collectionMock));
      });

      beforeEach(async () => {
        el.setAttribute('collection', 'foo');
        await elementUpdated(el);
      });

      testFetch(/\/data\/foo\.json$/);

      testCardsRendering(collectionMock);

      it(`the collection and the collection in dc-stack are'nt the same instance`, () => {
        expect(el.shadowRoot)
          .to.have.descendant('.stack-0')
          .that.have.property('collection')
          .that.not.equal(el.boxes[0]);
      });

      describe('When: a button is clicked', () => {
        let firstStackEl;

        beforeEach(() => {
          firstStackEl = el.shadowRoot.querySelector('.stack-0');
          sinon.spy(firstStackEl, 'pop');
          sinon.spy(firstStackEl, 'moveBack');
        });

        describe('"ok" button', () => {
          beforeEach(() => {
            el.shadowRoot.querySelector('.action-ok').click();
          });

          it('DeckStack.pop() has been called on the first stack', () => {
            expect(firstStackEl.pop).to.have.been.calledOnce;
          });

          it('first card is moved to the next box', () => {
            expect(el)
              .to.have.property('boxes')
              .that.deep.equals([collectionMock.slice(0, -1), [collectionMock[collectionMock.length - 1]], []]);
          });
        });

        describe('"nok" button', () => {
          beforeEach(() => {
            el.shadowRoot.querySelector('.action-nok').click();
          });

          it('DeckStack.mockBack() has been called on the first stack', () => {
            expect(firstStackEl.moveBack).to.have.been.calledOnce;
          });
        });
      });

      describe(`When: an 'empty-stack' event is dispatched by a child component`, () => {
        beforeEach(async () => {
          el.shadowRoot.querySelector('.stack-0').dispatchEvent(new CustomEvent('empty-stack'));
          await elementUpdated(el);
        });

        it(`action buttons shouldn't be displayed`, () => {
          expect(el.shadowRoot)
            .to.have.descendant('.container')
            .that.has.class('empty');
          const actionWrappers = el.shadowRoot.querySelectorAll('.action-wrapper');
          [...actionWrappers].forEach(action => {
            const actionDisplay = getComputedStyle(action).display;
            expect(actionDisplay).to.equal('none');
            //// chai-dom gives a falls negative here
            //// it looks like it doesn't use computed style
            //// this isn't ralted to the loop
            //// see https://github.com/nathanboktae/chai-dom/issues/22
            // expect(action).not.to.be.displayed;
            //// equals ''
            // expect(action.style.display).to.equal('none');
          });
        });

        describe(`When: the current stack is empty`, () => {
          beforeEach(async () => {
            el.shadowRoot.querySelector('.stack-0').dispatchEvent(new CustomEvent('empty-stack'));
            await elementUpdated(el);
          });

          it(`action buttons shouldn't be displayed`, () => {
            expect(el.shadowRoot)
              .to.have.descendant('.container')
              .that.has.class('empty');
            const actionWrappers = el.shadowRoot.querySelectorAll('.action-wrapper');
            [...actionWrappers].forEach(action => {
              const actionDisplay = getComputedStyle(action).display;
              expect(actionDisplay).to.equal('none');
              //// chai-dom gives a falls negative here
              //// it looks like it doesn't use computed style
              //// this isn't ralted to the loop
              //// see https://github.com/nathanboktae/chai-dom/issues/22
              // expect(action).not.to.be.displayed;
              //// equals ''
              // expect(action.style.display).to.equal('none');
            });
          });

          describe(`When: the current stack is reloaded`, () => {
            beforeEach(async () => {
              el.shadowRoot.querySelector('.stack-0').dispatchEvent(new CustomEvent('reload-collection'));
              await elementUpdated(el);
            });

            it(`action buttons should be displayed`, () => {
              expect(el.shadowRoot)
                .to.have.descendant('.container')
                .that.not.has.class('empty');
              const actionWrappers = el.shadowRoot.querySelectorAll('.action-wrapper');
              [...actionWrappers].forEach(action => {
                const actionDisplay = getComputedStyle(action).display;
                expect(actionDisplay).not.to.equal('none');
              });
            });
          });
        });
      });
    });

    describe('When: an invalid collection name is given', () => {
      beforeEach(() => {
        fetchStub.callsFake(mockResponse404);
      });

      beforeEach(async () => {
        el.setAttribute('collection', mockCollectionName);
        await elementUpdated(el);
      });

      testFetch(/\/data\/foo\.json$/);

      it('an error message is shown', () => {
        expect(el.shadowRoot).to.have.descendant('.errors-container').that.is.visible.and.displayed;
        expect(el.shadowRoot)
          // see https://github.com/nathanboktae/chai-dom/issues/30#issuecomment-372759090
          // in order to understand why semantic-dom-diff & chai-dom are so different
          .to.have.descendant('.errors-container > p')
          .which.has.text(`No flashcard could be found for the ${mockCollectionName} collection.`);
      });
    });

    describe('Given: collection attribute is set to a falsy value', () => {
      beforeEach(async () => {
        el.setAttribute('collection', '');
        await elementUpdated(el);
      });

      it('no fetch', () => {
        expect(fetchStub).to.not.have.been.called;
      });

      testCardsRendering(null);
    });
  });

  describe('Given: collection attribute is set to a truthy string', () => {
    beforeEach(() => {
      fetchStub.callsFake(mockResponse200(collectionMock));
    });

    beforeEach(async () => {
      el = await fixture(`<dc-repetition collection="${mockCollectionName}"></dc-repetition>`);
    });

    testFetch(/\/data\/foo\.json$/);

    testCardsRendering(collectionMock);
  });

  afterEach(() => {
    fetchStub.restore();
  });
});
