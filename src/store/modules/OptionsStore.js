import { COUNTING_STRATEGY } from '../../game/counting';

const baseState = {
  numBots: "1",
  gameType: "2",
  countStrat: COUNTING_STRATEGY.ZEN
};

export const OPTIONS_MUTATIONS = {
  SET_BOTS: 'setBots',
  SET_GAME_TYPE: 'setGameType',
  SET_COUNT_STRAT: 'setCountStrat'
};

const mutations = {
  [OPTIONS_MUTATIONS.SET_BOTS] (state, numBots) {
    state.numBots = numBots;
  },
  [OPTIONS_MUTATIONS.SET_GAME_TYPE] (state, gameType) {
    state.gameType = gameType;
  },
  [OPTIONS_MUTATIONS.SET_COUNT_STRAT] (state, countStrat) {
    state.countStrat = countStrat;
  }
};

export const OPTIONS_ACTIONS = {};

const actions = {};

export const OPTIONS_GETTERS = {};

const getters = {};

export default {
  state: baseState,
  mutations,
  actions,
  getters
};