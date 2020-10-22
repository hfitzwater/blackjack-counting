<template>
  <div class="about">
    <h1 class="width-100 center game-title">
      Blackjack
    </h1>
    <Panel>
      <p>
        This game of blackjack can be played with or without the assistance of a card counting interface. Many different card counting techniques are supported.
      </p>
      <br>
      <p>
        This is a work in progress.
      </p>
      <br>
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

export default {
  name: "About",
  components: {
    Panel
  },
  methods: {
    back() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped lang="less">
</style>