<template>
  <div class="play">
    <Card v-for="(card,index) of cards" :key="index" :cardDetails="card" />
  </div>
</template>

<script>
import Blackjack from '../game/blackjack';
import Card from '../components/Card';

export default {
  name: "Play",
  components: {
    Card
  },
  data() {
    return {
      blackjack: null,
      cards: []
    }
  },
  created() {
    const numDecks = Number(this.$store.state.options.gameType);
    const numExtraPlayers = Number(this.$store.state.options.numBots);

    this.blackjack = new Blackjack({
      numDecks,
      numExtraPlayers
    });

    this.cards = this.blackjack.decks[0].peek(54);
    console.log(this.cards);
  }
}
</script>

<style scoped lang="less">

</style>