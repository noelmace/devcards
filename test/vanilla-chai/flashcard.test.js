import { expect } from '@bundled-es-modules/chai';

import '../../src/components/flashcard/flashcard.js';
import { waitForComponent } from '../utils/rendering.js';

describe('no content provided', () => {
  let el;

  beforeEach('Given: no initial slot / light DOM', async () => {
    const tagName = 'dc-flashcard';
    el = document.createElement(tagName);
    document.body.appendChild(el);
    return waitForComponent(tagName);
  });

  it('show an error message in "question"', async () => {
    // question slot fallback content
    const questionContent = el.shadowRoot.querySelectorAll('slot[name=question] > *');

    // Then: no new question slot in light DOM
    expect(el).to.have.property('innerHTML').that.is.empty;
    //    And: default question is an error
    expect([...questionContent[0].classList]).to.contains('error');
    //    And: there isn't anything else in the question slot
    expect(questionContent).to.have.lengthOf(1);
  });

  it('show an error message in "answer"', async () => {
    // answer slot fallback content
    const answerContent = el.shadowRoot.querySelectorAll('slot[name=answer] > *');

    // Then: no new answer slot in light DOM
    expect(el).to.have.property('innerHTML').that.is.empty;
    //    And: default answer is an error
    expect([...answerContent[0].classList]).to.contain('error');
    //    And: there isn't anything else in the answer slot
    expect(answerContent).to.have.lengthOf(1);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });
});
