import { COUNTING_STRATEGY } from '../../game/counting';

const baseState = {
  numBots: "2",
  gameType: "2",
  countStrat: COUNTING_STRATEGY.ZEN,
  showCount: true,
  playerName: 'Player'
};

export const OPTIONS_MUTATIONS = {
  SET_BOTS: 'setBots',
  SET_GAME_TYPE: 'setGameType',
  SET_COUNT_STRAT: 'setCountStrat',
  SET_SHOW_COUNT: 'setShowCount',
  SET_PLAYER_NAME: 'setPlayerName'
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
  },
  [OPTIONS_MUTATIONS.SET_SHOW_COUNT] (state, showCount) {
    state.showCount = showCount;
  },
  [OPTIONS_MUTATIONS.SET_PLAYER_NAME] (state, playerName) {
    state.playerName = playerName;
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