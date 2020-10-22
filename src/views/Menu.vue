<template>
  <div class="menu">
    <h1 class="width-100 center game-title">
      Blackjack
    </h1>
    <br><br>
    <div class="width-100">
      <cv-button @click="play()" kind="secondary" class="width-100">
        Play
      </cv-button>
      <br>
      <br>
      <cv-button @click="options()" kind="secondary" class="width-100">
        Options
      </cv-button>
    </div>
 </div>
</template>

<script>
export default {
  name: "Menu",
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
