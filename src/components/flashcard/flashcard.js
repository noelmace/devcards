import { css, html } from '../../utils/tags.js';

/**
 * @typedef {Object} Card
 * @property {String} question - sanitized HTML for the front of a flashcard
 * @property {String} answer - sanitized HTML for the back of a flashcard
 */

customElements.define(
  'dc-flashcard',
  class extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');

      style.textContent = css`
        .container {
          width: var(--card-width, 200px);
          perspective: 5000px;
          margin: 0 auto;
        }

        .flashcard {
          display: grid;
          transition: transform 0.8s;
          transform-style: preserve-3d;
          transform-origin: center right;
        }

        :host([flipped]) .flashcard {
          transform: translateX(-100%) rotateY(180deg);
        }

        .card-side {
          border-radius: 10px;
          border: 2px solid black;
          grid-row: 1;
          grid-column: 1;
          padding: .5em;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          height: calc(var(--card-width, 200px) * 1.39);
          overflow: auto;
          backface-visibility: hidden;
        }

        .card-side > * {
          flex: 1 1;
          margin: auto;
        }

        .card-side ul, .card-side ol {
          margin: 0;
        }

        .front {
          background-color: var(--question-bgcolor, red);
          color: var(--question-color, white);
          text-align: center;
        }

        .back {
          background-color: var(--answer-bgcolor, green);
          color: var(--answer-color, white);
          transform: rotateY(180deg);
        }

        .error {
          font-weight: bold;
          color: red;
        }

        /* TODO: firefox */

        .card-side::-webkit-scrollbar {
          width: 10px;
        }
        .card-side::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	        border-radius: 10px;
        }
        .card-side::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
          background-color: rgba(0, 0, 0, .3);
        }
        .card-side::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `;

      shadowRoot.appendChild(style);

      const flashcard = document.createElement('div');
      flashcard.classList.add('flashcard');
      const container = document.createElement('div');
      container.classList.add('container');
      container.appendChild(flashcard);

      const front = document.createElement('div');
      front.classList.add('card-side', 'front');
      const back = document.createElement('div');
      back.classList.add('card-side', 'back');

      flashcard.appendChild(front);
      flashcard.appendChild(back);

      const question = document.createElement('div');
      question.setAttribute('class', 'question');
      question.innerHTML = html`
        <slot name="question">
          <p class="error">Error: No question was provided</p>
        </slot>
      `;

      front.appendChild(question);

      const answer = document.createElement('div');
      answer.setAttribute('class', 'answer');
      answer.innerHTML = html`
        <slot name="answer">
          <p class="error">Error: No answer was provided</p>
        </slot>
      `;

      this.addEventListener('click', e => {
        this.flip();
      });

      back.appendChild(answer);
      shadowRoot.appendChild(container);
    }

    /**
     * reflect the 'flipped' attribute
     * if the flipped attribute is set, the card will show its "answer" backside
     * if not, the "question" frontside is shown
     */
    get flipped() {
      return this.hasAttribute('flipped');
    }

    /**
     * flip the card
     * show the answer if it's hidden, or go back to the answser
     * @modifies {(flipped)}
     */
    flip() {
      if (this.flipped) {
        this.removeAttribute('flipped');
      } else {
        this.setAttribute('flipped', '');
      }
    }
  }
);

/**
 * Card object to `<dc-flashcard>` html
 * @param {Card} card
 * @param {String} style - css string to apply to the dc-flashcard
 * @returns {String} - HTML
 */
export const cardHtml = ({ question, answer }, style = '') => html`
  <dc-flashcard style="${style}">
    <div slot="question">
      ${question}
    </div>
    <div slot="answer">
      ${answer}
    </div>
  </dc-flashcard>
`;
