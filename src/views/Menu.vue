<template>
  <div class="menu">
    <h1 class="width-100 center game-title">
      Blackjack
    </h1>
    <Panel>
      <div>
        <cv-button @click="play()" kind="primary" class="width-100">
          Play
        </cv-button>
      </div>
      <br>
      <div>
        <cv-button @click="options()" kind="tertiary" class="width-100">
          Options
        </cv-button>
     </div>
    </Panel>
 </div>
</template>

<script>
import Panel from '../components/Panel';

export default {
  name: "Menu",
  components: {
    Panel
  },
  methods: {
    play() {
      this.$router.push('/play');
    },
    options() {
      this.$router.push('/options');
    }
  }
};
</script>

<style scoped lang="less">
  .menu {
    text-align: center;
  }
</style>
