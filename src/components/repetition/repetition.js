import { cardHtml } from '../flashcard/flashcard.js';
import '../loader/loader.js';
import { css, html } from '../../utils/tags.js';

/**
 * @typedef {Object} Card
 * @property {String} question - sanitized HTML for the front of a flashcard
 * @property {String} answer - sanitized HTML for the back of a flashcard
 */

/**
 * Card array to a "stacked deck" HTML
 * @param {Array.<Card>} cards
 * @returns {String} - HTML
 */
const cardsStackHtml = cards => html`
  <div style="padding-top: ${cards.length * 5}px; display: grid">
    ${cards.map(
      (card, i) => cardHtml(card, `position: relative; top: ${i * -5}px; grid-row: 1; grid-column: 1`)
    ).join('')}
  </div>
`;

customElements.define(
  'dc-repetition',
  class extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = css`
        .container {
          display: flex;
          align-items: center;
        }

        .flashcards-container {
          flex-grow: 1;
        }

        :host(:not(.loading)) deck-loader {
          display: none;
        }

        :host(.loading) .flashcards-container,
        :host(.errors) .flashcards-container {
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

      const container = document.createElement('div');
      container.classList.add('container');

      const iconsSize = '50px';
      container.innerHTML = html`
        <div class="flashcards-container"></div>
        <div class="errors"></div>
        <deck-loader></deck-loader>
      `;

      shadowRoot.appendChild(container);
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
     * show an HTML error message in the `.error` element
     * @param {String} htmlContent - sanitized / trusted HTML to render
     */
    showErrors(htmlContent) {
      const errors = this.shadowRoot.querySelector('.errors');
      errors.innerHTML = htmlContent;
      this.classList.add('errors');
      this.classList.remove('loading');
    }

    /**
     * hides the `.errors` element
     */
    closeErrors() {
      this.classList.remove('errors');
    }

    /**
     * set the loading state of the component
     *
     * @param {Boolean} [on=true] - value to set the loading state to
     */
    isLoading(on = true) {
      // TODO: async?
      const loader = this.shadowRoot.querySelector('deck-loader');
      if (on) {
        this.loadingTimeoutId = setTimeout(this.classList.add('loading'), 200);
        loader.removeAttribute('paused');
        this.closeErrors();
      } else {
        clearTimeout(this.loadingTimeoutId);
        loader.setAttribute('paused', '');
        this.classList.remove('loading');
      }
    }

    /**
     * true if the collection attribute match the rendered flashcards
     * @type {Boolean}
     */
    get areCardsRendered() {
      return !this.classList.contains('loading') && !this.classList.contains('errors');
    }

    /**
     * fetch & render the collection of flashcards
     * @private
     */
    async updateCards() {
      this.isLoading();
      try {
        const cards = await this.fetchCards(this.collection);
        this.renderCards(cards);
      } catch (e) {
        this.showErrors(html`
          <p>No flashcard could be found for the ${this.collection} collection.</p>
        `);
      }
      this.isLoading(false);
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

      return cards;
    }

    /**
     * render cards objects as `<dc-flashcard>` components in the `.flashcards-container` element
     * @private
     * @param {Array.<Card>} cards the card objects to render
     * @modifies {(this.container)}
     */
    renderCards(cards) {
      this.shadowRoot.querySelector('.flashcards-container').innerHTML = cardsStackHtml(cards);
    }
  }
);
