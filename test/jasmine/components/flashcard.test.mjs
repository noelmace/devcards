import { waitForComponent } from '../../utils/rendering.js';

import '../../../src/components/flashcard/flashcard.js';

describe('dc-flashcard component', () => {
  describe('no content provided', () => {
    let el;

    beforeEach(async () => {
      // 'Given: no initial slot / light DOM'
      const tagName = 'dc-flashcard';
      el = document.createElement(tagName);
      document.body.appendChild(el);
      return waitForComponent(tagName);
    });

    it('show an error message in "question"', async () => {
      // question slot fallback content
      const questionContent = el.shadowRoot.querySelectorAll('slot[name=question] > *');

      // Then: no new question slot in light DOM
      expect(el.innerHTML).toBe('');
      //    And: default question is an error
      expect(questionContent[0]).toHaveClass('error');
      //    And: there isn't anything else in the question slot
      expect(questionContent.length).toBe(1);
    });

    it('show an error message in "answer"', async () => {
      // answer slot fallback content
      const answerContent = el.shadowRoot.querySelectorAll('slot[name=answer] > *');

      // Then: no new answer slot in light DOM
      expect(el.innerHTML).toBe('');
      //    And: default answer is an error
      expect(answerContent[0]).toHaveClass('error');
      //    And: there isn't anything else in the answer slot
      expect(answerContent.length).toBe(1);
    });

    afterEach(() => {
      document.body.removeChild(el);
    });
  });
});
