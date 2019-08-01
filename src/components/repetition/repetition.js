import '../flashcard/flashcard.js';
import { css, html } from '../../utils/tags.js';

/**
 * @typedef {Object} Card
 * @property {String} question - sanitized HTML for the front of a flashcard
 * @property {String} answer - sanitized HTML for the back of a flashcard
 */

customElements.define(
  'dc-repetition',
  class extends HTMLElement {
    constructor() {
      super();

      /**
       * true if the collection attribute match the rendered flashcards
       * @type {Boolean}
       */
      this.areCardsRendered = false;

      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = css`
        .flashcards-container {
          display: grid;
        }

        .flashcards-container > dc-flashcard {
          grid-row: 1;
          grid-column: 1;
        }
      `;

      shadowRoot.appendChild(style);

      this.container = document.createElement('div');
      this.container.classList.add('container');

      this.flashcardsContainer = document.createElement('div');
      this.flashcardsContainer.classList.add('flashcards-container');
      this.container.appendChild(this.flashcardsContainer);

      shadowRoot.appendChild(this.container);
    }


    /**
     * mandatory `collection` attribute
     * name of the flashcard collection to retrieve & render
     * @type {String}
     */
    get collection() {
      return this.getAttribute('collection');
    }

    /**
     * @private
     */
    static get observedAttributes() {
      return ['collection'];
    }

    /**
     * update the flashcards collection when the attribute value changes
     * @private
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'collection') {
        this.updateCards();
      }
    }

    /**
     * retrieve the flashcard
     * @private
     */
    connectedCallback() {
      if (!this.areCardsRendered) {
        this.updateCards();
      }
    }

    /**
     * fetch & render the collection of flashcards
     * @private
     */
    updateCards() {
      this.areCardsRendered = false;
      this.classList.add('loading');
      this.fetchCards(this.collection)
        .then(cards => this.renderCards(cards))
        .then(() => {
          this.classList.remove('loading');
          this.areCardsRendered = true;
        })

    }

    /**
     * fetch a flashcards json file
     * @private
     * @param {string} topic the name of the json file to retrieve
     * @returns {Array.<Card> | null} cards in the json file, or null if no card could be found
     */
    async fetchCards(topic) {
      const req = new Request(`/data/${topic}.json`);
      let cards = null;

      try {
        const resp = await fetch(req);
        const data = await resp.json();
        if (data.length > 0) {
          cards = data;
        }
      } catch (err) {
        console.error('no cards could be found');
      }

      return cards
    }

    /**
     * render cards objects as `<dc-flashcard>` components in the `.flashcards-container` element
     * @private
     * @param {Array.<Card>} cards the card objects to render
     * @modifies {(this.flashcardsContainer)}
     */
    renderCards(cards) {
      cards.forEach((card, i) => {
        const flashcard = document.createElement('dc-flashcard');
        flashcard.innerHTML = `
          <div slot="question">
            ${card.question}
          </div>
          <div slot="answer">
            ${card.answer}
          </div>
        `;
        flashcard.style.position = 'relative';
        flashcard.style.top = i * -5 + 'px';
        this.flashcardsContainer.appendChild(flashcard);
      });
      this.flashcardsContainer.style.paddingTop = cards.length * 5 + 'px';
    }
  }
);
