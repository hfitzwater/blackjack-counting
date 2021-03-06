import Deck, { DESIGNATOR } from './deck';

const randRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const PLAYER_STATE = {
  ACTIVE: 'active',
  BUST: 'bust',
  STAND: 'stand',
  BLACKJACK: 'blackjack',
  PUSH: 'push'
};

/* 
  Easteregg: https://xkcd.com/948/
*/
export const AI = {
  STANDARD: 'standard',
  AGGRESSIVE: 'aggressive',
  CONSERVATIVE: 'conservative',
  /*
    Easteregg: https://www.historyvshollywood.com/reelfaces/21mitblackjack.php
  */
  MIKE: 'Mike Aponte'
};

export default class Blackjack {
    numDecks = 2;
    numExtraPlayers = 0;
    decks = [];
    players = [];
    queue = [];
    discard = [];
    monies = 0;
    score = 0;
    state = PLAYER_STATE.ACTIVE;
    cards = [];
    deckChart = {};

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
            monies: 1000,
            bet: 5,
            brain: AI.STANDARD,
            state: PLAYER_STATE.ACTIVE
          };

          if( !player.isHuman ) {
            const nameIndex = randRange(0, names.length - 1);
            player.name = names[nameIndex];

            names.splice(nameIndex, 1);

            Object.assign(player, this.getRandomBrain());
          }

          this.players.push(player);
        }

        this.decks = this.resetDecks( this.numDecks );
        this.queue = [];
        this.decks.forEach(deck => {
            this.queue = this.queue.concat(deck.cards);
        });

        this.deckChart = this.resetDeckChart();
    }

    static getCardValue(card) {
      const isJack = card.designator === DESIGNATOR.JACK;
      const isQueen = card.designator === DESIGNATOR.QUEEN;
      const isKing = card.designator === DESIGNATOR.KING;
      const isAce = card.designator === DESIGNATOR.ACE;

      if( isJack || isQueen || isKing ) {
        return 10;
      } else if( isAce ) {
        return 11;
      }

      return Number(card.designator.name);
    }

    static getHandValue(cards, raw=false) {
      let score = cards.reduce((acc, card) => {
        return acc + Blackjack.getCardValue(card);
      }, 0);

      if( !raw ) {
        const hasAces = cards.filter(c => c.designator === DESIGNATOR.ACE);
        let numAces = hasAces.length;
        while( score > 21 && numAces > 0 ) {
          score -= 10;
          numAces -= 1;
        }
      }

      return score;
    }

    getRandomBrain() {
      const level = randRange(0,3);
      const brains = {
        [0]: AI.AGGRESSIVE,
        [1]: AI.STANDARD,
        [2]: AI.CONSERVATIVE,
        [3]: AI.MIKE
      };
      
      return {
        brain: brains[level],
        level: level + 1
      };
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

    shiftQueue() {
      const card = this.queue.shift();
      this.updateDeckChart(card);

      if( this.queue.length > 0 && this.queue.length % 52 === 0 ) {
        /*
          Deck expired
          shuffle and cycle top deck
        */
        let topDeck = this.decks.shift();
        topDeck.shuffle();

        this.queue = this.queue.concat(topDeck.cards);

        this.deckChart = this.resetDeckChart();
      }

      return card;
    }

    resetDeckChart() {
      let deckChart = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0
      };

      const fakeDeck = new Deck();
      fakeDeck.cards.forEach(card => {
        let cardValue = Blackjack.getCardValue(card);

        if(cardValue === 11) cardValue = 1;

        deckChart[cardValue]++;
      });

      return deckChart;
    }

    updateDeckChart( card ) {
      let val = Blackjack.getCardValue(card);
      if( val === 11 ) val = 1;

      this.deckChart[val]--;
    }

    getDeckChartData() {
      const deckChartData = Object.keys(this.deckChart).map(value => {
        return {
          group: value,
          value: Number(this.deckChart[value])
        };
      });

      return deckChartData;
    }

    getChanceToBust( playerIndex ) {
      const numAces = this.players[playerIndex].cards.filter(c => c.designator === DESIGNATOR.ACE).length;
      const currentScore = Blackjack.getHandValue(this.players[playerIndex].cards, true) - 10*numAces;

      const minBust = 22 - currentScore;

      if( minBust > 10 ) return 0;

      const totalCardsLeftInDeck = this.queue.length % 52;

      let numDangerousCards = 0;
      for(let i=0; i<totalCardsLeftInDeck; i++) {
        const card = this.queue[i];
        const value = Blackjack.getCardValue(card);

        if( value > minBust ) {
          numDangerousCards++;
        }
      }

      const chance = (numDangerousCards / totalCardsLeftInDeck) * 100;
      return Math.round((chance + Number.EPSILON) * 100) / 100;
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
      } else if( dealerInitialScore >= 18 ) {
        this.state = PLAYER_STATE.STAND;
      }
    }

    payout() {
      const payouts = {};
      const houseScore = Blackjack.getHandValue(this.cards);

      this.players.forEach(player => {
        let playerWasPaid = false;
        
        const addPayout = (player, amount) => {
          playerWasPaid = true;

          payouts[player.index] = amount;
        };

        const playerScore = Blackjack.getHandValue(player.cards);

        const houseBust = this.state === PLAYER_STATE.BUST;
        const playerBust = player.state === PLAYER_STATE.BUST;

        if( !houseBust ) {
          if( !playerBust ) {
            if( playerScore > houseScore ) {
              const amount = player.bet * 2;
              player.monies += amount;

              addPayout(player, amount);

              this.monies -= player.bet;
            }
          }
        } else {
          if( !playerBust ) {
            const amount = player.bet * 2;
            player.monies += amount;

            addPayout(player, amount);

            this.monies -= player.bet * 1.5;
          }
        }

        if( !playerWasPaid ) {
          addPayout(player, -1 * player.bet);
        }
      });

      return payouts;
    }
}

const TASK = {
  HIT: 'hit',
  BET: 'bet'
};

const BRAINS = {
  [TASK.HIT]: {
    [AI.STANDARD]: (score) => {
      return score < 16;
    },
    [AI.AGGRESSIVE]: (score) => {
      return score < 17;
    },
    [AI.CONSERVATIVE]: (score) => {
      return score < 15;
    },
    [AI.MIKE]: (score, count, blackjack) => {
      const effectiveScore = score - count;
      const dealerScore = Blackjack.getCardValue(blackjack.cards[1]);
  
      if( dealerScore === 10 && effectiveScore < 18) {
        return true;
      }
  
      if( score <= 14 ) {
        return true;
      }
  
      if( effectiveScore <= 10 ) {
        return true;
      }
  
      if( dealerScore <= 6 && effectiveScore <= 13 ) {
        return true;
      }
  
      return false;
    }
  },
  [TASK.BET]: {
    [AI.STANDARD]: () => {
      return 10;
    },
    [AI.AGGRESSIVE]: () => {
      return 15;
    },
    [AI.CONSERVATIVE]: () => {
      return 5;
    },
    [AI.MIKE]: (count) => {
      let bet = 10;

      if( count >= 7 ) {
        bet = 25;
      } else if( count >= 3) {
        bet = 20
      } else if( count >= 1 ) {
        bet = 15;
      }

      if( count <= -3 ) {
        bet = 5;
      }

      return bet;
    },
  }
};

export class BotBrain {
  static willHit(player, score, count, blackjack) {
    return BRAINS[TASK.HIT][player.brain](score, count, blackjack);
  }

  static getBet(player, count) {
    return BRAINS[TASK.BET][player.brain](player, count);
  }
}