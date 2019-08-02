import '../flashcard/flashcard.js';
import '../loader/loader.js';
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

        :host(:not(.loading)) deck-loader {
          display: none;
        }

        :host(.loading) .flashcards-container, :host(.errors) .flashcards-container {
          display: none;
        }

        .errors {
          display: none;
          color: red;
        }

        :host(.errors) .errors {
          display: block;
        }
      `;

      shadowRoot.appendChild(style);

      this.container = document.createElement('div');
      this.container.classList.add('container');

      this.errors = document.createElement('div');
      this.errors.classList.add('errors');
      this.container.appendChild(this.errors);

      this.loader = document.createElement('deck-loader');
      this.container.appendChild(this.loader);

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
    async updateCards() {
      this.areCardsRendered = false;
      const loadingTimeoutId = setTimeout(this.classList.add('loading'), 200);
      this.loader.removeAttribute('paused');
      this.classList.remove('errors');
      try {
        const cards = await this.fetchCards(this.collection);
        this.renderCards(cards);
      } catch(e) {
        this.errors.innerHTML = html`
          <p>No flashcard could be found for the ${this.collection} collection.</p>
        `;
        this.classList.add('errors');
      }
      clearTimeout(loadingTimeoutId);
      this.classList.remove('loading');
      this.loader.setAttribute('paused', '');
      this.areCardsRendered = true;
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

      const resp = await fetch(req);
      if (!resp.ok) {
        throw new Error(resp.errors);
      }
      const data = await resp.json();
      if (data.length > 0) {
        cards = data;
      }

      return cards
    }

    /**
     * render cards objects as `<dc-flashcard>` components in the `.flashcards-container` element
     * @private
     * @param {Array.<Card>} cards the card objects to render
     * @modifies {(this.container)}
     */
    renderCards(cards) {
      const oldContainer = this.shadowRoot.querySelector('.flashcards-container');
      if (oldContainer) {
        oldContainer.parentNode.removeChild(oldContainer);
      }

      const flashcardsContainer = document.createElement('div');
      flashcardsContainer.classList.add('flashcards-container');
      this.container.appendChild(flashcardsContainer);
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
        flashcardsContainer.appendChild(flashcard);
      });
      flashcardsContainer.style.paddingTop = cards.length * 5 + 'px';
      this.container.appendChild(flashcardsContainer);
    }
  }
);
