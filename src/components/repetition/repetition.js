import '../card-stack/card-stack.js';
import '../loader/loader.js';
import { css, html } from '../../utils/tags.js';

/**
 * Main component for spaced repetition
 */
class RepetitionComponent extends HTMLElement {
  constructor() {
    super();

    let resolve;

    this._updatePromise = new Promise(res => {
      resolve = res;
    });

    this.attachShadow({ mode: 'open' });

    /**
     * Leitner System boxes
     * @private
     */
    this._boxes = [[], [], []];

    this._initialRender();

    resolve();
  }

  static get _styles() {
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
    return style;
  }

  _initialRender() {
    this.shadowRoot.appendChild(RepetitionComponent._styles);

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

    this.shadowRoot.appendChild(this.container);

    this.shadowRoot.querySelector('.action-ok').addEventListener('click', () => {
      const poped = this.shadowRoot.querySelector('.stack-0').pop();
      // FIXME: double data
      this._boxes[0].pop();
      this._boxes[1] = [...this._boxes[1], poped.card];
    });

    this.shadowRoot.querySelector('.action-nok').addEventListener('click', () => {
      this.shadowRoot.querySelector('.stack-0').moveBack();
    });

    this.shadowRoot.querySelector('.stack-0').addEventListener('empty-stack', () => {
      this.container.classList.add('empty');
    });

    this.shadowRoot.querySelector('.stack-0').addEventListener('reload-collection', () => {
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
   * inspired by lit-element
   * @see {@link https://github.com/Polymer/lit-element/blob/v2.2.1/src/lib/updating-element.ts#L729-L746}
   * @returns {Promise.<Boolean>} The Promise returns a boolean that indicates if the
   * update resolved without triggering another update.
   */
  get updateComplete() {
    return this._updatePromise;
  }

  /**
   * Leitner System boxes
   * @see {@link https://en.wikipedia.org/wiki/Leitner_system}
   */
  get boxes() {
    return [[...this._boxes[0]], [...this._boxes[1]], [...this._boxes[2]]];
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
    if (name === 'collection' && oldValue !== newValue) {
      this._enqueueUpdate(this._updateCards(newValue));
    }
  }

  /**
   * retrieve the flashcard
   * @private
   */
  connectedCallback() {
    if (!this.areCardsRendered) {
      this._enqueueUpdate(this._updateCards());
    }
  }

  /**
   * show an HTML error message in the `.error` element
   * @param {String} htmlContent - sanitized / trusted HTML to render
   * @private
   */
  _renderErrors(htmlContent) {
    const errors = this.shadowRoot.querySelector('.errors-container');
    errors.innerHTML = htmlContent;
    this.container.classList.add('errors');
    this.container.classList.remove('loading');
  }

  /**
   * hides the `.errors-container` element
   * @private
   */
  _closeErrors() {
    this.container.classList.remove('errors');
  }

  /**
   * set the loading state of the component
   * @private
   * @param {Boolean} [on=true] - value to set the loading state to
   */
  _setLoader(on = true) {
    const loader = this.shadowRoot.querySelector('deck-loader');
    if (on) {
      this.loadingTimeoutId = setTimeout(this.container.classList.add('loading'), 200);
      loader.removeAttribute('paused');
      this._closeErrors();
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
    return (
      !this.container.classList.contains('loading') &&
      !this.container.classList.contains('errors') &&
      this._renderedCollection === this.collection
    );
  }

  /**
   * fetch & render the collection of flashcards
   * @private
   */
  async _updateCards(collectionName) {
    let collection;
    this._setLoader();
    if (collectionName) {
      try {
        collection = await this._fetchCards(collectionName);
      } catch (e) {
        this._renderErrors(html`
          <p>No flashcard could be found for the ${collectionName} collection.</p>
        `);
      }
    } else {
      this.container.classList.remove('errors');
      this.container.classList.add('empty');
      collection = '';
    }
    this.shadowRoot.querySelector('.stack-0').collection = collection;
    this._boxes[0] = collection ? [...collection] : [];
    this._renderedCollection = collectionName;
    this._setLoader(false);
  }

  /**
   * @param {Promise} update
   * @private
   */
  async _enqueueUpdate(update) {
    const previousUpdate = this.updateComplete || Promise.resolve();
    let resolve, reject;
    this._updatePromise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    try {
      await previousUpdate;
      await update;
      resolve();
    } catch (err) {
      reject(err);
    }
  }

  /**
   * fetch a flashcards json file
   * @private
   * @param {string} topic the name of the json file to retrieve
   * @returns {Array.<Card> | null} cards in the json file, or null if no card could be found
   */
  async _fetchCards(topic) {
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
}

customElements.define('dc-repetition', RepetitionComponent);
