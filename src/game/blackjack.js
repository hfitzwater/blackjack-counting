import Deck from './deck';

const randRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const PLAYER_STATE = {
  ACTIVE: 'active',
  BUST: 'bust',
  STAY: 'stay',
  BLACKJACK: 'blackjack',
  PUSH: 'push'
};

export default class Blackjack {
    numDecks = 2;
    numExtraPlayers = 0;
    decks = [];
    players = [];
    queue = [];
    discard = [];
    score = 0;
    state = PLAYER_STATE.ACTIVE;
    cards = [];

    constructor(options) {
        let names = [
          'Bob',
          'Jerry',
          'Becky',
          'Karen',
          'Tim',
          'Rick',
          'Randy',
          'Larry',
          'Buck',
          'Anne'
        ];

        if( options ) {
            if( options.numDecks ) {
                this.numDecks = options.numDecks;
            }
    
            if( options.numExtraPlayers ) {
                this.numExtraPlayers = options.numExtraPlayers;
            }
        }

        for(let p=0; p<this.numExtraPlayers + 1; p++) {
          let player = {
            isHuman: p === 0,
            index: p + 1,
            cards: [],
            thinking: false,
            score: 0,
            state: PLAYER_STATE.ACTIVE
          };

          if( !player.isHuman ) {
            const nameIndex = randRange(0, names.length - 1);
            player.name = names[nameIndex];

            names.splice(nameIndex, 1);
          }

          this.players.push(player);
        }

        this.decks = this.resetDecks( this.numDecks );
        this.queue = [];
        this.decks.forEach(deck => {
            this.queue = this.queue.concat(deck.cards);
        });
    }

    resetDecks( numDecks ) {
        let decks = [];

        for(let i=0; i<numDecks; i++) {
            decks.push(new Deck({
              effectiveDeckNumber: i
            }).shuffle());
        }

        return decks;
    }

    static getCardValue(card) {
      const isJack = card.designator.name === "J";
      const isQueen = card.designator.name === "Q";
      const isKing = card.designator.name === "K";
      const isAce = card.designator.name === "A";

      if( isJack || isQueen || isKing ) {
        return 10;
      } else if( isAce ) {
        return 11;
      }

      return Number(card.designator.name);
    }

    static getHandValue(cards) {
      let score = cards.reduce((acc, card) => {
        return acc + Blackjack.getCardValue(card);
      }, 0);

      const hasAce = cards.find(c => c.designator.name === 'A');
      if( score > 21 && hasAce ) {
        score -= 10;
      }

      return score;
    }

    shiftQueue() {
      const card = this.queue.shift();

      if( this.queue.length > 0 && this.queue.length % 52 === 0 ) {
        /*
          Deck expired
          shuffle and cycle top deck
        */
        let topDeck = this.decks.shift();
        topDeck.shuffle();

        this.queue = this.queue.concat(topDeck.cards);
      }

      return card;
    }

    collectDiscards() {
      this.discard = this.cards.concat(this.discard);
      
      this.players.forEach(player => {
        this.discard = player.cards.concat(this.discard);
      });
    }

    resetPlayerState() {
      this.state = PLAYER_STATE.ACTIVE;
      this.cards = [];

      this.players.forEach(player => {
        player.state = PLAYER_STATE.ACTIVE;
        player.cards = [];
      });
    }

    markBlackjacks() {
      const dealerInitialScore = Blackjack.getHandValue(this.cards);
      if( dealerInitialScore === 21 ) {
        this.state = PLAYER_STATE.BLACKJACK;
      }

      this.players.forEach(player => {
        const initialScore = Blackjack.getHandValue(player.cards);
        if( initialScore === 21 ) {
          player.state = PLAYER_STATE.BLACKJACK;
        }
      });
    }

    deal() {
        this.collectDiscards();
        this.resetPlayerState();

        let participantCards = [this.cards];
        this.players.forEach(player => {
          participantCards.push(player.cards);
        });

        for(let cardNumber=0; cardNumber < 2; cardNumber++) {
          for(let pIndex=0; pIndex<participantCards.length; pIndex++) {
            if( cardNumber === 0 && pIndex === 0 ) {
              // Dealer hole
              let hole = this.shiftQueue();
              hole.isHole = true;
              participantCards[pIndex].push(hole);
            } else {
              participantCards[pIndex].push(this.shiftQueue());
            }
          }
        }

        this.markBlackjacks();

        return this;
    }

    hitPlayer(player) {
      player.cards.push(this.shiftQueue());
    }

    hitDealer() {
      this.cards.push(this.shiftQueue());

      const dealerInitialScore = Blackjack.getHandValue(this.cards);
      if( dealerInitialScore === 21 ) {
        this.state = PLAYER_STATE.BLACKJACK;
      } else if( dealerInitialScore > 21 ) {
        this.state = PLAYER_STATE.BUST;
      }
    }
}