import '../card-stack/card-stack.js';
import '../loader/loader.js';
import { css, html } from '../../utils/tags.js';

/**
 * Main component for spaced repetition
 */
class RepetitionComponent extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = css`
      .container {
        display: flex;
        align-items: center;
      }

      .container > * {
        flex: 1 1;
      }

      .container > :nth-child(1) {
        text-align: right;
        padding-right: 1em;
      }

      .container > :nth-child(3) {
        text-align: left;
        padding-left: 1em;
      }

      .container:not(.loading) deck-loader {
        display: none;
      }

      .container.loading .flashcards-container,
      .container.errors .flashcards-container {
        display: none;
      }

      .cards-container {
        counter-reset: card;
      }

      .cards-container > dc-flashcard {
        counter-increment: card;
        position: relative;
      }

      .errors-container {
        display: none;
        color: red;
      }

      .container.errors .errors-container {
        display: block;
      }

      .container.empty .action-wrapper, .container.errors .action-wrapper, .container.loading .action-wrapper   {
        display: none;
      }

      i {
        background-size: contain;
        height: var(--icons-size, 50px);
        width: var(--icons-size, 50px);
        display: inline-block;
      }

      i.thumb-up {
        background-image: url("${new URL('./thumb-up.svg', import.meta.url).toString()}");
      }

      i.thumb-down {
        background-image: url("${new URL('./thumb-down.svg', import.meta.url).toString()}");
      }
    `;

    shadowRoot.appendChild(style);

    this.container = document.createElement('div');
    this.container.classList.add('empty');
    this.container.classList.add('container');

    this.container.innerHTML = html`
      <div class="action-wrapper">
        <i class="thumb-up action action-ok"></i>
      </div>
      <div class="flashcards-container">
        <dc-stack class="stack-0"></dc-stack>
      </div>
      <div class="action-wrapper">
        <i class="thumb-down action action-nok"></i>
      </div>
      <div class="errors-container"></div>
      <deck-loader></deck-loader>
    `;

    shadowRoot.appendChild(this.container);

    /**
     * Leitner System boxes
     * @private
     * @see {@link https://en.wikipedia.org/wiki/Leitner_system}
     */
    this.boxes = [[], [], []];

    shadowRoot.querySelector('.action-ok').addEventListener('click', () => {
      const poped = shadowRoot.querySelector('.stack-0').pop();
      this.boxes[1] = [...this.boxes, poped.card];
    });

    shadowRoot.querySelector('.action-nok').addEventListener('click', () => {
      shadowRoot.querySelector('.stack-0').moveBack();
    });

    shadowRoot.querySelector('.stack-0').addEventListener('empty-stack', () => {
      this.container.classList.add('empty');
    });

    shadowRoot.querySelector('.stack-0').addEventListener('reload-collection', () => {
      this.container.classList.remove('empty');
    });
  }

  /**
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
      if (this.collection) {
        this.updateCards();
      } else {
        this.container.classList.remove('errors');
        this.container.classList.add('empty');
        this.renderCards('');
      }
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
    const errors = this.shadowRoot.querySelector('.errors-container');
    errors.innerHTML = htmlContent;
    this.container.classList.add('errors');
    this.container.classList.remove('loading');
  }

  /**
   * hides the `.errors-container` element
   */
  closeErrors() {
    this.container.classList.remove('errors');
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
      this.loadingTimeoutId = setTimeout(this.container.classList.add('loading'), 200);
      loader.removeAttribute('paused');
      this.closeErrors();
    } else {
      clearTimeout(this.loadingTimeoutId);
      loader.setAttribute('paused', '');
      this.container.classList.remove('loading');
      this.container.classList.remove('empty');
    }
  }

  /**
   * true if the collection attribute match the rendered flashcards
   * @type {Boolean}
   */
  get areCardsRendered() {
    return !this.container.classList.contains('loading') && !this.container.classList.contains('errors');
  }

  /**
   * fetch & render the collection of flashcards
   * @private
   */
  async updateCards() {
    this.isLoading();
    try {
      this.boxes[0] = await this.fetchCards(this.collection);
    } catch (e) {
      this.showErrors(html`
        <p>No flashcard could be found for the ${this.collection} collection.</p>
      `);
    }
    this.renderCards(this.boxes[0]);
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
   */
  renderCards(cards) {
    this.shadowRoot.querySelector('.stack-0').collection = cards;
  }
}

customElements.define('dc-repetition', RepetitionComponent);
