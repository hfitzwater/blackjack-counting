export const SUIT = {
    HEARTS: {
        name: 'hearts',
        icon: '♥',
        color: 'red'
    },
    DIAMONDS: {
        name: 'diamonds',
        icon: '♦',
        color: 'red'
    },
    CLUBS: {
        name: 'clubs',
        icon: '♣',
        color: 'black'
    },
    SPADES: {
        name: 'spades',
        icon: '♠',
        color: 'black'
    }
};

export const SPECIAL_SUIT = {
    JOKER: {
        name: 'joker',
        icon: 'J',
        color: 'black'
    }
};

export const DESIGNATOR = {
    NONE: {
        name: 'NONE'
    },
    TWO: {
        name: '2'
    },
    THREE: {
        name: '3'
    },
    FOUR: {
        name: '4'
    },
    FIVE: {
        name: '5'
    },
    SIX: {
        name: '6'
    },
    SEVEN: {
        name: '7'
    },
    EIGHT: {
        name: '8'
    },
    NINE: {
        name: '9'
    },
    TEN: {
        name: '10'
    },
    JACK: {
        name: 'J'
    },
    QUEEN: {
        name: 'Q'
    },
    KING: {
        name: 'K'
    },
    ACE: {
        name: 'A'
    }
};

export default class Deck {
    options = {
        jokers: 0,
        effectiveDeckNumber: 0
    };
    cards = [];

    constructor(options) {
        if( options ) {
            if( options.jokers ) {
                this.options.jokers = options.jokers;
            }

            if( options.effectiveDeckNumber ) {
                this.options.effectiveDeckNumber = options.effectiveDeckNumber;
            }
        }

        this.cards = Deck.initCards(this.options.jokers, this.options.effectiveDeckNumber);
        this.shuffle();

        return this;
    }

    static initCards(numJokers, effectiveDeckNumber=0) {
        const allSuits = Object.keys(SUIT);
        const allDesig = Object.keys(DESIGNATOR).filter(key => key !== DESIGNATOR.NONE.name);

        let cards = [];
        allSuits.forEach(suitKey => {
            allDesig.forEach(desigKey => {
                cards.push(new Card(SUIT[suitKey], DESIGNATOR[desigKey], effectiveDeckNumber));
            });
        });

        if( numJokers ) {
            for(let i=0; i<numJokers; i++) {
                cards.push(new Card(SPECIAL_SUIT.JOKER, DESIGNATOR.NONE, effectiveDeckNumber));
            }
        }

        return cards;
    }

    peek( num ) {
        return this.cards.slice(0, num);
    }

    take( num ) {
        const hand = this.cards.slice(0, num);
        this.cards = this.cards.slice(num);

        return hand;
    }

    shuffle() {
        const randRange = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        let shuffledCards = [];
        while( this.cards.length ) {
            const chosenIndex = randRange(0, this.cards.length - 1);
            shuffledCards.push(this.cards[chosenIndex]);

            this.cards.splice(chosenIndex, 1);
        }

        this.cards = shuffledCards;

        return this;
    }
}

export class Card { 
    suit = null;
    designator = null;
    effectiveDeckNumber = 0;
    
    constructor(suit, designator, effectiveDeckNumber=0) {
        this.suit = suit;
        this.designator = designator; 
        this.effectiveDeckNumber = effectiveDeckNumber;
    }
}