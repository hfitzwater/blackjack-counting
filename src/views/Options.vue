<template>
  <div class="options">
    <h1 class="width-100 center">
      Blackjack
    </h1>
    <Panel>
      <div>
        <cv-dropdown theme="light" label="Bots" :value="numBots" @change="numBotsChanged($event)">
          <cv-dropdown-item value="1">
            1
          </cv-dropdown-item>
          <cv-dropdown-item value="2">
            2
          </cv-dropdown-item>
          <cv-dropdown-item value="3">
            3
          </cv-dropdown-item>
          <cv-dropdown-item value="4">
            4
          </cv-dropdown-item>
        </cv-dropdown>
      </div>
      <br>
      <div>
        <cv-dropdown theme="light" label="Game Type" :value="gameType" @change="gameTypeChanged($event)">
          <cv-dropdown-item value="2">
            Pitch (2 Decks)
          </cv-dropdown-item>
          <cv-dropdown-item value="6">
            Shoe (6 Decks)
          </cv-dropdown-item>
        </cv-dropdown>
      </div>
      <br>
      <div>
        <cv-dropdown theme="light" label="Counting Strategy" :value="countStrat" @change="countStratChanged($event)">
          <cv-dropdown-item v-for="strat in strats" :key="strat" :value="strat">
            {{ strat }}
          </cv-dropdown-item>
        </cv-dropdown>
      </div>
      <br>
      <div>
        <cv-checkbox label="Show Count" :checked="showCount" :value="showCount.toString()" @change="showCountChanged($event)">
        </cv-checkbox>
      </div>
      <br>
      <div>
        <router-link to="/"> Back </router-link>
      </div>
    </Panel>
  </div>
</template>

<script>
import Panel from '../components/Panel';
import { COUNTING_STRATEGY } from '../game/counting';
import { OPTIONS_MUTATIONS } from '../store/modules/OptionsStore';

export default {
  name: "Options",
  components: {
    Panel
  },
  data() {
    return {
      strats: Object.keys(COUNTING_STRATEGY).map(key => COUNTING_STRATEGY[key]),
      numBots: this.$store.state.options.numBots,
      gameType: this.$store.state.options.gameType,
      countStrat: this.$store.state.options.countStrat,
      showCount: this.$store.state.options.showCount
    }
  },
  methods: {
    numBotsChanged(newValue) {
      this.$store.commit(OPTIONS_MUTATIONS.SET_BOTS, newValue);
    },
    gameTypeChanged(newValue) {
      this.$store.commit(OPTIONS_MUTATIONS.SET_GAME_TYPE, newValue);
    },
    countStratChanged(newValue) {
      this.$store.commit(OPTIONS_MUTATIONS.SET_COUNT_STRAT, newValue);
    },
    showCountChanged(newValue) {
      this.$store.commit(OPTIONS_MUTATIONS.SET_SHOW_COUNT, newValue);
    }
  }
}
</script>

<style scoped lang="less">
</style>