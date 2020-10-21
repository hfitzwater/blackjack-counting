import { DESIGNATOR } from './deck';

export const COUNTING_STRATEGY = {
    NONE: 'none',
    HI_LO: 'hi_lo',
    HI_1: 'hi_opt_1',
    HI_2: 'hi_opt_2',
    KO: 'ko',
    OMEGA_2: 'omega_2',
    RED_7: 'red_7',
    HALVES: 'halves',
    ZEN: 'zen'
};

export const CARD_VALUES = {
    [COUNTING_STRATEGY.HI_LO]: {
        [DESIGNATOR.TWO.name]: 1,
        [DESIGNATOR.THREE.name]: 1,
        [DESIGNATOR.FOUR.name]: 1,
        [DESIGNATOR.FIVE.name]: 1,
        [DESIGNATOR.SIX.name]: 1,
        [DESIGNATOR.SEVEN.name]: 0,
        [DESIGNATOR.EIGHT.name]: 0,
        [DESIGNATOR.NINE.name]: 0,
        [DESIGNATOR.TEN.name]: -1,
        [DESIGNATOR.JACK.name]: -1,
        [DESIGNATOR.QUEEN.name]: -1,
        [DESIGNATOR.KING.name]: -1,
        [DESIGNATOR.ACE.name]: -1
    },
    [COUNTING_STRATEGY.HI_1]: {
        [DESIGNATOR.TWO.name]: 0,
        [DESIGNATOR.THREE.name]: 1,
        [DESIGNATOR.FOUR.name]: 1,
        [DESIGNATOR.FIVE.name]: 1,
        [DESIGNATOR.SIX.name]: 1,
        [DESIGNATOR.SEVEN.name]: 0,
        [DESIGNATOR.EIGHT.name]: 0,
        [DESIGNATOR.NINE.name]: 0,
        [DESIGNATOR.TEN.name]: -1,
        [DESIGNATOR.JACK.name]: -1,
        [DESIGNATOR.QUEEN.name]: -1,
        [DESIGNATOR.KING.name]: -1,
        [DESIGNATOR.ACE.name]: 0
    },
    [COUNTING_STRATEGY.HI_2]: {
        [DESIGNATOR.TWO.name]: 1,
        [DESIGNATOR.THREE.name]: 1,
        [DESIGNATOR.FOUR.name]: 2,
        [DESIGNATOR.FIVE.name]: 2,
        [DESIGNATOR.SIX.name]: 1,
        [DESIGNATOR.SEVEN.name]: 1,
        [DESIGNATOR.EIGHT.name]: 0,
        [DESIGNATOR.NINE.name]: 0,
        [DESIGNATOR.TEN.name]: -2,
        [DESIGNATOR.JACK.name]: -2,
        [DESIGNATOR.QUEEN.name]: -2,
        [DESIGNATOR.KING.name]: -2,
        [DESIGNATOR.ACE.name]: 0
    },
    [COUNTING_STRATEGY.KO]: {
        [DESIGNATOR.TWO.name]: 1,
        [DESIGNATOR.THREE.name]: 1,
        [DESIGNATOR.FOUR.name]: 1,
        [DESIGNATOR.FIVE.name]: 1,
        [DESIGNATOR.SIX.name]: 1,
        [DESIGNATOR.SEVEN.name]: 1,
        [DESIGNATOR.EIGHT.name]: 0,
        [DESIGNATOR.NINE.name]: 0,
        [DESIGNATOR.TEN.name]: -1,
        [DESIGNATOR.JACK.name]: -1,
        [DESIGNATOR.QUEEN.name]: -1,
        [DESIGNATOR.KING.name]: -1,
        [DESIGNATOR.ACE.name]: -1
    },
    [COUNTING_STRATEGY.OMEGA_2]: {
        [DESIGNATOR.TWO.name]: 1,
        [DESIGNATOR.THREE.name]: 1,
        [DESIGNATOR.FOUR.name]: 2,
        [DESIGNATOR.FIVE.name]: 2,
        [DESIGNATOR.SIX.name]: 2,
        [DESIGNATOR.SEVEN.name]: 1,
        [DESIGNATOR.EIGHT.name]: 0,
        [DESIGNATOR.NINE.name]: -1,
        [DESIGNATOR.TEN.name]: -2,
        [DESIGNATOR.JACK.name]: -2,
        [DESIGNATOR.QUEEN.name]: -2,
        [DESIGNATOR.KING.name]: -2,
        [DESIGNATOR.ACE.name]: 0
    },
    [COUNTING_STRATEGY.RED_7]: {
        [DESIGNATOR.TWO.name]: 1,
        [DESIGNATOR.THREE.name]: 1,
        [DESIGNATOR.FOUR.name]: 1,
        [DESIGNATOR.FIVE.name]: 1,
        [DESIGNATOR.SIX.name]: 1,
        [DESIGNATOR.SEVEN.name]: 0,
        [DESIGNATOR.EIGHT.name]: 0,
        [DESIGNATOR.NINE.name]: 0,
        [DESIGNATOR.TEN.name]: -1,
        [DESIGNATOR.JACK.name]: -1,
        [DESIGNATOR.QUEEN.name]: -1,
        [DESIGNATOR.KING.name]: -1,
        [DESIGNATOR.ACE.name]: -1
    },
    [COUNTING_STRATEGY.HALVES]: {
        [DESIGNATOR.TWO.name]: 0.5,
        [DESIGNATOR.THREE.name]: 1,
        [DESIGNATOR.FOUR.name]: 1,
        [DESIGNATOR.FIVE.name]: 1.5,
        [DESIGNATOR.SIX.name]: 1,
        [DESIGNATOR.SEVEN.name]: 0.5,
        [DESIGNATOR.EIGHT.name]: 0,
        [DESIGNATOR.NINE.name]: -0.5,
        [DESIGNATOR.TEN.name]: -1,
        [DESIGNATOR.JACK.name]: -1,
        [DESIGNATOR.QUEEN.name]: -1,
        [DESIGNATOR.KING.name]: -1,
        [DESIGNATOR.ACE.name]: -1
    },
    [COUNTING_STRATEGY.ZEN]: {
        [DESIGNATOR.TWO.name]: 1,
        [DESIGNATOR.THREE.name]: 1,
        [DESIGNATOR.FOUR.name]: 2,
        [DESIGNATOR.FIVE.name]: 2,
        [DESIGNATOR.SIX.name]: 2,
        [DESIGNATOR.SEVEN.name]: 1,
        [DESIGNATOR.EIGHT.name]: 0,
        [DESIGNATOR.NINE.name]: 0,
        [DESIGNATOR.TEN.name]: -2,
        [DESIGNATOR.JACK.name]: -2,
        [DESIGNATOR.QUEEN.name]: -2,
        [DESIGNATOR.KING.name]: -2,
        [DESIGNATOR.ACE.name]: -1
    },
};

export default class Counter {
    static lookupValue(designator, countingStrat) {
        if( countingStrat === COUNTING_STRATEGY.NONE ) {
            return 0;
        }

        return CARD_VALUES[countingStrat][designator.name];
    }

    static countCards(cards, countingStrat) {
        return cards.reduce((acc, card) => {
            return acc + Counter.lookupValue(card.designator, countingStrat);
        }, 0);
    }
}