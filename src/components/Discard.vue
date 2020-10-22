<template>
  <div class="discard" v-if="showCount">
    <div>
      <h2 class="width-100 center" style="padding: 0.3em 0;">Discard</h2>
      <span>
        <!-- (DeckNumber), [Total Cards] -->
        ({{ Math.floor(blackjack.discard.length / 52) }}) [{{ blackjack.discard.length }}]
      </span>
    </div>
    <div v-for="card of blackjack.discard" :key="getKeyForCard(card)">
      <Card :cardDetails="card" />
    </div>
  </div>
</template>

<script>
import Card from '../components/Card';

export default {
  name: "Discard",
  components: {
    Card
  },
  methods: {
    getKeyForCard(card) {
      return `${card.designator.name} of ${card.suit.name} in Deck:${card.effectiveDeckNumber}`;
    }
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
    background-color: rgba(45,25,5,0.9);
  }
</style>