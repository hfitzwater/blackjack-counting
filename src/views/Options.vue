<template>
  <div class="options">
    <h1 class="width-100 center game-title">
      Blackjack
    </h1>
    <Panel>
      <div>
        <cv-dropdown theme="light" label="Bots" :value="numBots" @change="numBotsChanged($event)">
          <cv-dropdown-item value="0">
            0
          </cv-dropdown-item>
          <cv-dropdown-item value="1">
            1
          </cv-dropdown-item>
          <cv-dropdown-item value="2">
            2
          </cv-dropdown-item>
          <cv-dropdown-item value="3">
            3
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
        <cv-toggle
          :checked="showCount"
          label="Count"
          @change="showCountChanged($event)"
          :value="showCount.toString()">
          <template slot="text-left">Disabled</template>
          <template slot="text-right">Enabled</template>
        </cv-toggle>
      </div>
      <br>
      <div>
        <cv-text-input
          label="Player Name"
          :value="playerName.toString()"
          @change="playerNameChanged($event)"
          placeholder="Enter Your Name">
        </cv-text-input>
      </div>
      <br>
      <div>
        <cv-button @click="back()" kind="secondary" class="width-100" style="max-width: none;">
          Back
        </cv-button>
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
      showCount: this.$store.state.options.showCount,
      playerName: this.$store.state.options.playerName
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
    },
    playerNameChanged(event) {
      this.$store.commit(OPTIONS_MUTATIONS.SET_PLAYER_NAME, event.target.value);
    },
    back() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped lang="less">
</style>