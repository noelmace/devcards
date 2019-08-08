import '../../src/components/flashcard/flashcard.js';
import { waitForComponent } from '../utils/rendering.js';

describe('no content provided', () => {

  beforeEach(async () => {
    // Given: no initial slot / light DOM'
    document.body.innerHTML = `
      <dc-flashcard id="fixture"></dc-flashcard>
    `
    await waitForComponent('dc-flashcard')

    // const tag = 'dc-flashcard';
    // el = document.createElement(tag);
    // document.body.appendChild(el);
    // console.log(el.shadowRoot);
  });

  it('show an error message in "question"', () => {
    const el = document.querySelector('dc-flashcard');

    // question slot fallback content
    const questionContent = el.shadowRoot.querySelectorAll('slot[name=question] > *');

    // Then: no new question slot in light DOM
    expect(el.innerHTML).toBe('');
    //    And: default question is an error
    expect([...questionContent[0].classList]).toContain('error');
    //    And: there isn't anything else in the question slot
    expect(questionContent.length).toBe(1);
  });

  it('show an error message in "answer"', () => {
    const el = document.querySelector('dc-flashcard');

    // answer slot fallback content
    const answerContent = el.shadowRoot.querySelectorAll('slot[name=answer] > *');

    // Then: no new answer slot in light DOM
    expect(el.innerHTML).toBe('');
    //    And: default answer is an error
    expect([...answerContent[0].classList]).toContain('error');
    //    And: there isn't anything else in the answer slot
    expect(answerContent.length).toBe(1);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });
});
