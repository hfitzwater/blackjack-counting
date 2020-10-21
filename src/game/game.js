
// const Deck = require('./deck').Deck;
// const Counter = require('./counting').Counter;
// const COUNTING_STRATEGY = require('./counting').COUNTING_STRATEGY;

// const strat = COUNTING_STRATEGY.KO;

// let deck = new Deck();
// let hand = deck.peek(5);

// let handCount = Counter.countCards(hand, strat);
// let deckCount = Counter.countCards(deck.cards, strat);

// console.log('Hand', hand, handCount);
// console.log('Deck', deckCount);

import Blackjack from './blackjack';

let game = new Blackjack({
    numDecks: 3,
    numExtraPlayers: 2
});

game.deal();

game.players.forEach(player => {
    console.log(player.cards);
});