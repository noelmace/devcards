import { css } from '../../utils/tags.js';
import { backAndForth } from '../../utils/array.js';

customElements.define(
  'deck-loader',
  class extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');

      /*
       * It's generally better to write a prototype which will generate some complicated CSS,
       * and then to copy paste the result in your WC instead of directly running this code in it!
       * Spare all unnecessary JS to the browser!
       *
       * Well, actually, in this case, I was inspired by https://github.com/selfthinker/CSS-Playing-Cards/blob/master/cards.css.
       * Thanks to Anika Henke <anika@selfthinker.org> for her work, and sharing it under CC BY-SA.
       * Go to http://selfthinker.github.com/CSS-Playing-Cards/ for more information.
       */
      style.innerText = css`
        .cards-container {
          height: 100px;
          width: 10em;
          position: absolute;
        }

        .card {
          background-color: green;
          width: 50px;
          height: 75px;
          position: absolute;
          bottom: 0;
          border: 1px solid black;
          box-shadow: 0.2em 0.2em 0.5em #333;
          transition: ${this.interval / 1000}s ease;
          left: 0;
        }

        .selected {
          margin-bottom: 2em;
        }

        .card.deployed:nth-child(1) {
          transform: translate(0.3em, 0.1em) rotate(-6deg);
          left: 4.4em;
        }

        .card.deployed:nth-child(2) {
          transform: translate(-0.1em, 0.1em) rotate(3deg);
          left: 5.5em;
        }

        .card.deployed:nth-child(3) {
          transform: translate(-0.5em, 0.2em) rotate(12deg);
          left: 6.6em;
        }

        .card.deployed:nth-child(4) {
          transform: translate(-0.9em, 0.3em) rotate(21deg);
          left: 7.7em;
        }

        .card.deployed:nth-child(5) {
          transform: translate(-1.3em, 0.6em) rotate(30deg);
          left: 8.8em;
        }
      `;

      shadowRoot.appendChild(style);

      const cardsContainer = document.createElement('div');
      cardsContainer.classList.add('cards-container');

      /**
       * @type {Array.<HTMLElement>}
       */
      this.cards = [];

      for (let i = 0; i < 5; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        this.cards.push(card);
        cardsContainer.appendChild(card);
      }

      this.deckGen = backAndForth(this.cards);

      shadowRoot.appendChild(cardsContainer);
    }

    /**
     * animation interval in ms
     * @default 500
     * @type {Number}
     */
    get interval() {
      const interval = Number.parseInt(this.getAttribute('interval'));
      if (interval && !isNaN(interval)) {
        return interval;
      }
      return 500;
    }

    /**
     * stop the animation if true
     * @default false
     * @type {boolean}
     */
    get paused() {
      return this.hasAttribute('paused');
    }

    /**
     * @private
     */
    static get observedAttributes() {
      return ['paused'];
    }

    /**
     * pause or start the animation
     * @private
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'paused' && oldValue !== newValue) {
        if (typeof newValue === 'string') {
          this.stopAnimation();
        } else if (this.deckGen) {
          this.startAnimation();
        }
      }
    }

    /**
     * @private
     */
    connectedCallback() {
      this.startAnimation();
    }

    /**
     * @private
     */
    disconnectedCallback() {
      this.stopAnimation();
    }

    /**
     * Start or resume the animation
     */
    startAnimation() {
      if (!this.animationIntervalId) {
        this.animationIntervalId = setInterval(
          () => this.deckGen.next().value.classList.toggle('deployed'),
          this.interval
        );
      }
    }

    stopAnimation() {
      if (this.animationIntervalId) {
        clearInterval(this.animationIntervalId);
        this.animationIntervalId = null;
      }
    }
  }
);
