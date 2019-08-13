import { fixture, expect, elementUpdated } from '@open-wc/testing';

import '../../../src/components/repetition/repetition.js';
import { mockResponse200 } from '../../utils/http.js';

import { collectionMock } from '../../mocks/collection.js';
import sinon from 'sinon';

describe('dc-repetition component', () => {
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

    describe('When: a collection name is given', function() {
      before(function() {
        this.fetchStub = sinon.stub(window, 'fetch');
        // don't use stub.resolves or stub.returns here, because the same Response instance would be used every time
        // which would leads to a "Failed to execute 'json' on 'Response': body stream is locked" error
        this.fetchStub.callsFake(mockResponse200(collectionMock));
      })

      beforeEach(async function() {
        this.el.setAttribute('collection', 'foo');
        await elementUpdated(this.el);
      });

      it('data is fetched', function() {
        expect(this.fetchStub).to.have.been.calledWithMatch({ url: sinon.match(/\/data\/foo\.json$/) });
      });

      it('cards are rendered into the first box', function() {
        expect(this.el.shadowRoot)
          .to.have.descendant('.stack-0')
          .which.has.property('collection')
          .that.deep.equals(collectionMock);
      });
    });
  });
});
