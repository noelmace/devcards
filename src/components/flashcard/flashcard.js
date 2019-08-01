import { css, html } from '../../utils/tags.js';

customElements.define(
  'dc-flashcard',
  class extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');

      style.textContent = css`
        .container {
          padding: 5px;
          perspective: 5000px;
        }

        .flashcard {
          display: grid;
          transition: transform .8s;
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
          padding: 1em;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .front {
          background-color: var(--question-bgcolor, red);
          color: var(--question-color, white);
          text-align: center;
          backface-visibility: hidden;
        }

        .back {
          background-color: var(--answer-bgcolor, green);
          color: var(--answer-color, white);
          transform: rotateY( 180deg );
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
      question.innerHTML = html`<slot name="question"></slot>`

      front.appendChild(question);

      const answer = document.createElement('div');
      answer.setAttribute('class', 'answer');
      answer.innerHTML = html`<slot name="answer"></slot>`

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