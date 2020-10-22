<template>
  <div class="discard">
    <div class="width-100 center">
      <h2>Discard</h2>
      <span>
        <!-- (DeckNumber), [CardsFromCurrentDeck] -->
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
    }
  }
}
</script>

<style scoped lang="less">

</style>