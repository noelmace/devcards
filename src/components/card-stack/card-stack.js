import { css, html } from '../../utils/tags.js';
import { cardHtml } from '../flashcard/flashcard.js';

/**
 * Web Component representing a stacked flashcard deck
 */
class CardStackComponent extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');

    style.innerText = css`
      .card-wrapper {
        height: 0;
        margin-top: -5px;
      }

      .cards-stack {
        height: calc(var(--card-width) * 1.39);
      }

      dc-flashcard {
        height: 500px;
        width: 300px;
        overflow: scroll;
      }

      .empty-box {
        text-align: center;
      }

      i {
        background-size: contain;
        height: var(--icons-size, 50px);
        width: var(--icons-size, 50px);
        display: inline-block;
      }

      i.reload {
        background-image: url("${new URL('./reload.svg', import.meta.url).toString()}");
      }
    `;

    shadowRoot.appendChild(style);

    this.container = document.createElement('div');
    this.container.classList.add('cards-stack');
    shadowRoot.appendChild(this.container);

    /**
     * the deck of cards currently rendered
     * @private
     * @type {Array.<Card>}
     */
    this.currentDeck = [];

    /**
     * @private
     */
    this._collection = [];

    this.emptyStackEvent = new CustomEvent('empty-stack', {
      bubbles: false,
      cancelable: false,
      composed: true
    });

    this.reloadFromCollectionEvent = new CustomEvent('reload-collection', {
      bubbles: false,
      cancelable: false,
      composed: true
    });
  }

  /**
   * **Immutable** collection of cards
   * Updating this property will cause this component to render **all** its content.
   * Do so **only** if you need to load an entire new collection of cards!
   * @type {Array.<Cards>}
   */
  set collection(collection) {
    this.propertyChangedCallback('collection', this._collection, collection);
  }

  /**
   * @type {Array.<Cards>}
   */
  get collection() {
    return this._collection;
  }

  /**
   * remove the last (top) card from the deck
   * @returns  {{card: Card, element: HTMLElement}} - removed card object and the corresponsing HTMLElement
   */
  pop() {
    const lastCard = this.currentDeck[this.currentDeck.length - 1];
    this.currentDeck = this.currentDeck.slice(0, -1);
    const lastCardElmt = this.container.lastElementChild;
    this.container.removeChild(lastCardElmt);
    if (this.currentDeck.length <= 0) {
      this.dispatchEvent(this.emptyStackEvent);
      this.renderEmptyMsg();
    }
    return { card: lastCard, element: lastCardElmt };
  }

  renderEmptyMsg() {
    const emptyBox = document.createElement('div');
    emptyBox.classList.add('empty-box');
    emptyBox.innerHTML = html`
      <p>You finished this session! Click the reload button to review this collection again.</p>
      <i class="reload"></i>
    `;
    emptyBox.querySelector('.reload').addEventListener('click', () => {
      this.render(this._collection);
      this.currentDeck = this._collection;
      this.dispatchEvent(this.reloadFromCollectionEvent);
    });
    this.container.appendChild(emptyBox);
    this.classList.add('empty');
  }

  /**
   *
   */
  moveBack() {
    const lastCard = this.currentDeck[this.currentDeck.length - 1];
    this.currentDeck = [lastCard, ...this.currentDeck.slice(0, -1)];
    const elmt = this.container.lastElementChild;
    this.container.prepend(elmt);
    elmt.firstElementChild.removeAttribute('flipped');
  }

  /**
   * @private
   * @param {*} prop
   * @param {*} oldValue
   * @param {*} newValue
   */
  propertyChangedCallback(prop, oldValue, newValue) {
    // cards collections are considered immutable
    if (prop === 'collection' && oldValue !== newValue) {
      this.render(newValue);
      this._collection = newValue;
      this.currentDeck = this._collection;
    }
  }

  render(cards) {
    if (cards.length !== this.currentDeck.length) {
      this.container.style.paddingTop = `${cards.length * 5}px`;
    }
    this.container.innerHTML = cards
      .map(
        card => html`
          <div class="card-wrapper">
            ${cardHtml(card)}
          </div>
        `
      )
      .join('');
  }
}

customElements.define('dc-stack', CardStackComponent);
