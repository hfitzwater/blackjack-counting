import Deck from './deck';

export default class Blackjack {
    numDecks = 2;
    numExtraPlayers = 0;
    decks = [];
    players = [];
    queue = [];

    constructor(options) {
        if( options ) {
            if( options.numDecks ) {
                this.numDecks = options.numDecks;
            }
    
            if( options.numExtraPlayers ) {
                this.numExtraPlayers = options.numExtraPlayers;
            }
        }

        for(let p=0; p<this.numExtraPlayers + 1; p++) {
            this.players.push({
                cards: []
            });
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

    deal() {
        this.players.forEach((player) => {
            player.cards.push(this.queue.shift());
        });
    }
}