<template>
  <div class="player">
    <cv-loading style="position:absolute;" :active="thinking" overlay></cv-loading>
    <div class="state" v-if="player.state !== PLAYER_STATE.ACTIVE">
      {{ player.state.toUpperCase() }}
    </div>

    <h3>{{ player.isHuman ? 'Player' : player.name }} ({{ total }})</h3>
    <div>
      <Card v-for="(card,index) of player.cards" :key="index" :cardDetails="card" />
    </div>
    <div v-if="player.isHuman">
      <cv-button @click="hit()" :disabled="botsPlaying">
        Hit
      </cv-button>
      <cv-button kind="secondary" @click="stay()" :disabled="botsPlaying">
        Stay
      </cv-button>
    </div>
  </div>
</template>

<script>
import Card from '../components/Card';
import Blackjack from '../game/blackjack';
import { PLAYER_STATE } from '../game/blackjack';

export default {
  name: "Player",
  components: {
    Card
  },
  props: [
    "playerDetails",
    "botsPlaying"
  ],
  data() {
    return {
      PLAYER_STATE,
      player: this.playerDetails
    }
  },
  mounted() {
    console.log(this.player);
  },
  methods: {
    hit() {
      this.blackjack.hitPlayer(this.player);
      const score = Blackjack.getHandValue(this.player.cards);

      if( score === 21 ) {
        this.player.state = PLAYER_STATE.BLACKJACK;
      } else if( score > 21 ) {
        this.player.state = PLAYER_STATE.BUST;
      }

      this.$emit('continue');
    },
    stay() {
      this.player.state = PLAYER_STATE.STAY;

      this.$emit('continue');
    }
  },
  computed: {
    total() {
      return Blackjack.getHandValue(this.player.cards);
    },
    blackjack() {
      // TODO: change access
      return this.$store.state.blackjack.blackjack;
    },
    thinking() {
      return this.player.thinking;
    }
  }
}
</script>

<style scoped lang="less">
  .player {
    position: relative;
    padding: 1em;
  }

  .state {
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: rgba(22, 22, 22, 0.5);
    color: white;
    position: absolute;
    z-index: 100;
    font-size: 3em;
    text-align: right;
    padding: 0.2em;
  }
</style>