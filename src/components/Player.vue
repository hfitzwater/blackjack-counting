<template>
  <div class="player">
    <cv-loading style="position:absolute;" :active="thinking" overlay></cv-loading>
    <div class="state" v-if="player.state !== PLAYER_STATE.ACTIVE">
      <cv-toast-notification
        class="notif"
        title="Status"
        :sub-title="player.state.toUpperCase()">
      </cv-toast-notification>
    </div>

    <h3>{{ player.isHuman ? 'Player' : player.name }} ({{ total }})</h3>
    <div>
      <Card v-for="(card, index) of player.cards" :key="getKeyForCard(card)" :cardDetails="card" :index="index" />
    </div>
    <div v-if="player.isHuman">
      <cv-button @click="hit()" :disabled="botsPlaying" class="width-50 center">
        Hit
      </cv-button>
      <cv-button kind="secondary" @click="stay()" :disabled="botsPlaying" class="width-50 center">
        Stay
      </cv-button>
      <br><br>
      <div style="font-size: 1.5em;">
        Running Count: {{ Counter.countCards(getExposedCards(), countStrat) }}
      </div>
    </div>
  </div>
</template>

<script>
import Card from '../components/Card';
import Blackjack from '../game/blackjack';
import { PLAYER_STATE } from '../game/blackjack';
import Counter from '../game/counting';

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
      Counter,
      PLAYER_STATE,
      player: this.playerDetails,
      countStrat: this.$store.state.options.countStrat
    }
  },
  methods: {
    getKeyForCard(card) {
      return `${card.designator.name} of ${card.suit.name}`;
    },
    getExposedCards() {
      return this.blackjack.players.reduce((acc, player) => {
        return acc.concat(player.cards);
      }, this.blackjack.discard);
    },
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
    position: absolute;
    z-index: 100;
    font-size: 3em;
    text-align: right;
    padding: 0.2em;

    .notif {
      margin: auto;
      position: relative;
      top: 110px;
    }
  }
</style>