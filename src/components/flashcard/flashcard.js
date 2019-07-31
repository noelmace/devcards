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
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
          padding: 1em;
          border-radius: 10px;
          display: grid;
          align-items: center;
          border: 5px solid black;
        }
        :host([flipped]) .container {
          background-color: var(--answer-bgcolor, green);
          color: var(--answer-color, white);
        }
        :host(:not([flipped])) .container {
          background-color: var(--question-bgcolor, red);
          color: var(--question-color, white);
        }
        .question, .answer {
          grid-row: 1;
          grid-column: 1;
        }
        .question {
          text-align: center;
        }
      `;

      shadowRoot.appendChild(style);

      const container = document.createElement('div');
      container.setAttribute('class', 'container');

      shadowRoot.appendChild(container);

      this.question = document.createElement('div');
      this.question.setAttribute('class', 'question');
      this.question.innerHTML = html`<slot name="question"></slot>`

      this.answer = document.createElement('div');
      this.answer.setAttribute('class', 'answer');
      this.answer.innerHTML = html`<slot name="answer"></slot>`

      this.addEventListener('click', e => {
        this.flip();
        console.log('flipped');
      });

      container.appendChild(this.question);
      container.appendChild(this.answer);

      this.showSide(true);
    }

    get flipped() {
      return this.hasAttribute('flipped');
    }

    flip() {
      if (this.flipped) {
        this.removeAttribute('flipped');
        this.showSide(true);
      } else {
        this.setAttribute('flipped', '');
        this.showSide(false);
      }
    }

    showSide(front = true) {
      this.question.style.visibility = front ? 'visible' : 'hidden';
      this.answer.style.visibility = front ? 'hidden' : 'visible';
    }
  }
);
