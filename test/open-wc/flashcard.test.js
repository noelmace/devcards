import {
  html,
  fixture,
  expect,
  chai
} from '@open-wc/testing';

import { chaiDom } from '../chai-dom/chai-dom.js';

chai.use(chaiDom);

import '../../src/components/flashcard/flashcard.js';

describe('no content provided', () => {

  let el;

  beforeEach(async () => {
    // Given: no initial slot / light DOM
    el = await fixture('<dc-flashcard></dc-flashcard>');
  })

  it('show an error message in "question"', async () => {
    // question slot fallback content
    const questionContent = el.shadowRoot.querySelectorAll('slot[name=question] > *');

    // Then: no new question slot in light DOM
    expect(el).lightDom.to.equal('')
    //    And: default question is an error
    expect(questionContent[0]).to.have.class('error')
    //    And: there isn't anything else in the question slot
    expect(questionContent.length).to.equal(1);
  });

  it('show an error message in "answer"', async () => {
    // answer slot fallback content
    const answerContent = el.shadowRoot.querySelectorAll('slot[name=answer] > *');

    // Then: no new question slot in light DOM
    expect(el).lightDom.to.equal('')
    //    And: default question is an error
    expect(answerContent[0]).to.have.class('error')
    //    And: there isn't anything else in the question slot
    expect(answerContent.length).to.equal(1);
  });
});

