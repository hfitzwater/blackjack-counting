import Vue from 'vue';
import Vuex from 'vuex';

import options from './modules/OptionsStore';
import blackjack from './modules/BlackjackStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    options,
    blackjack
  }
});
