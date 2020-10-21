const baseState = {
  blackjack: null
};

export const BLACKJACK_MUTATIONS = {
  SET_BLACKJACK: 'setBlackjack'
};

const mutations = {
  [BLACKJACK_MUTATIONS.SET_BLACKJACK] (state, blackjack) {
    state.blackjack = blackjack;
  }
};

export const BLACKJACK_ACTIONS = {};

const actions = {};

export const BLACKJACK_GETTERS = {};

const getters = {};

export default {
  state: baseState,
  mutations,
  actions,
  getters
};