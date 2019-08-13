import { fixture, expect } from '@open-wc/testing';

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
      expect(this.el.shadowRoot).to.have.descendant('dc-stack').that.has.property('collection').which.is.null;
    });

    describe('When: a collection name is given', function() {
      beforeEach(function() {
        this.fetchStub = sinon.stub(window, 'fetch');
        this.fetchStub.onCall(0).returns(mockResponse200(collectionMock));
        this.el.setAttribute('collection', 'foo');
      })

      it('data is fetched', function() {
        expect(this.fetchStub).to.have.been.calledWithMatch({url: sinon.match(/\/data\/foo\.json$/)});
      })
    });
  });
});
