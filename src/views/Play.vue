<template>
  <div class="play">
    <h1>This is the play page</h1>
  </div>
</template>

<script>
import Blackjack from '../game/blackjack';

export default {
  name: "Play",
  data() {
    return {
      blackjack: null
    }
  },
  created() {
    const numDecks = Number(this.$store.state.options.gameType);
    const numExtraPlayers = Number(this.$store.state.options.numBots);

    this.blackjack = new Blackjack({
      numDecks,
      numExtraPlayers
    });

    console.log( this.blackjack );
  }
}
</script>

<style scoped lang="less">

</style>