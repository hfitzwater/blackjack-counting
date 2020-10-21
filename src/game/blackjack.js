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
    cards = [];

    constructor(options) {
        let names = [
          'Bob',
          'Jerry',
          'Becky',
          'Karen',
          'Tim',
          'Rick',
          'Jess',
          'Randy',
          'Larry',
          'Buck',
          'Sandy',
          'Rachel',
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
            decks.push(new Deck().shuffle());
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

    deal() {
        this.discard = this.cards.concat(this.discard);
        this.cards = [];

        let hole = this.queue.shift();
        hole.isHole = true;

        this.cards.push(hole);
        this.cards.push(this.queue.shift());

        this.players.forEach((player) => {
            player.state = PLAYER_STATE.ACTIVE;
            this.discard = player.cards.concat(this.discard);
            player.cards = [];

            player.cards.push(this.queue.shift());
            player.cards.push(this.queue.shift());

            const initialScore = Blackjack.getHandValue(player.cards);
            if( initialScore === 21 ) {
              player.state = PLAYER_STATE.BLACKJACK;
            }
        });

        return this;
    }

    hitPlayer(player) {
      player.cards.push(this.queue.shift());
    }

    hitDealer() {
      this.cards.push(this.queue.shift());
    }
}