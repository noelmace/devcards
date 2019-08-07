import { chai, expect } from '@bundled-es-modules/chai';

import '../../src/components/flashcard/flashcard.js';

describe('no content provided', () => {

  let el;

  beforeEach(async () => {
    // Given: no initial slot / light DOM
    el = document.createElement('dc-flashcard');
    document.body.appendChild(el);
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  })

  it('show an error message in "question"', async () => {
    // question slot fallback content
    const questionContent = el.shadowRoot.querySelectorAll('slot[name=question] > *');

    // Then: no new question slot in light DOM
    expect(el).to.have.property('innerHTML').that.is.empty
    //    And: default question is an error
    expect([...questionContent[0].classList]).to.contains('error')
    //    And: there isn't anything else in the question slot
    expect(questionContent).to.have.length(1);
  });

  it('show an error message in "answer"', async () => {
    // answer slot fallback content
    const answerContent = el.shadowRoot.querySelectorAll('slot[name=answer] > *');

    // Then: no new question slot in light DOM
    expect(el).to.have.property('innerHTML').that.is.empty
    //    And: default question is an error
    expect([...answerContent[0].classList]).to.contain('error')
    //    And: there isn't anything else in the question slot
    expect(answerContent).to.have.length(1);
  });

  afterEach(() => {
    document.body.removeChild(el);
  })
});
