import Deck, { SUIT, SPECIAL_SUIT, DESIGNATOR } from '@/game/deck';

const NUM_SUITS = 4;
const CARDS_PER_DECK = 52;
const CARDS_PER_SUIT = CARDS_PER_DECK / NUM_SUITS;

describe('Deck', () => {
  it(`creates ${CARDS_PER_DECK} cards without jokers option`, () => {
    const deck = new Deck();

    expect(deck.cards.length).toBe(CARDS_PER_DECK);
  });

  it('applies effectiveDeckNumber to cards', () => {
    const deckNumber = 23;
    const deck = new Deck({
      effectiveDeckNumber: deckNumber
    });

    deck.cards.forEach(c => {
      expect(c.effectiveDeckNumber).toBe(deckNumber);
    });
  });

  it(`contains ${CARDS_PER_SUIT} cards of each suit`, () => {
    const deck = new Deck();

    const hearts = deck.cards.filter(c => c.suit === SUIT.HEARTS);
    expect(hearts.length).toBe(CARDS_PER_SUIT);

    const diamonds = deck.cards.filter(c => c.suit === SUIT.DIAMONDS);
    expect(diamonds.length).toBe(CARDS_PER_SUIT);

    const spades = deck.cards.filter(c => c.suit === SUIT.SPADES);
    expect(spades.length).toBe(CARDS_PER_SUIT);

    const clubs = deck.cards.filter(c => c.suit === SUIT.CLUBS);
    expect(clubs.length).toBe(CARDS_PER_SUIT);
  });

  it('adds jokers when they are asked for', () => {
    const numJokers = 23;
    const deck = new Deck({
      jokers: numJokers
    });

    const jokers = deck.cards.filter(c => c.suit === SPECIAL_SUIT.JOKER);

    expect(jokers.length).toBe(numJokers);
  });
});
