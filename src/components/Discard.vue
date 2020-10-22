<template>
  <div class="discard" v-if="showCount">
    <div>
      <div class="width-100 center" style="padding: 0.5em 0;">
        <div style="padding: 0.5em 0;">
          <strong>
            Running Count
          </strong>
        </div>
        <div>
          {{ Counter.countCards(getExposedCards(), countStrat) }}
        </div>
      </div>
      <div class="width-100 center" style="padding: 0.5em 0;">
        <strong>
          Discard
        </strong>
      </div>
      <div>
        <!-- (DeckNumber), [Total Cards] -->
        ({{ Math.floor(blackjack.discard.length / 52) }}) [{{ blackjack.discard.length }}]
      </div>
    </div>
    <div v-for="card of blackjack.discard" :key="getKeyForCard(card)">
      <Card :cardDetails="card" />
    </div>
  </div>
</template>

<script>
import Card from '../components/Card';
import Counter from '../game/counting';

export default {
  name: "Discard",
  components: {
    Card
  },
  data() {
    return {
      Counter,
      countStrat: this.$store.state.options.countStrat
    };
  },
  methods: {
    getKeyForCard(card) {
      return `${card.designator.name} of ${card.suit.name} in Deck:${card.effectiveDeckNumber}`;
    },
    getExposedCards() {
      return this.blackjack.players.reduce((acc, player) => {
        return acc.concat(player.cards);
      }, this.blackjack.discard);
    },
  },
  computed: {
    blackjack() {
      return this.$store.state.blackjack.blackjack;
    },
    showCount() {
      return this.$store.state.options.showCount;
    }
  }
}
</script>

<style scoped lang="less">
  .discard {
    height: 100%;
    max-width: 15%;
    overflow-y: scroll;
    text-align: center;
    color: #efefef;
    flex: 1 1 auto;
    border-right: 2px solid rgb(18, 18, 18);
    border-left: 2px solid rgb(18, 18, 18);
    background-color: rgba(45,25,5,0.6);
  }
</style>