<template>
  <div class="inline-block">
    <div :class="{ card: true, red: card.suit.color === 'red' }">
      <template v-if="!card.isHole">
        <div class="top-left">
          <div>
            {{ this.card.designator.name }}
          </div>
          <div>
            {{ this.card.suit.icon }}
          </div>
        </div>
        <div class="main-icon">
          {{ this.card.suit.icon }}
        </div>
        <div class="bottom-right">
          <div>
            {{ this.card.suit.icon }}
          </div>
          <div class="flip">
            {{ this.card.designator.name }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: [
    "cardDetails"
  ],
  data() {
    return {
      card: this.cardDetails
    }
  }
}
</script>

<style scoped lang="less">
  .card {
    cursor: pointer;
    margin: 4px;
    font-size: 20px;
    width: 150px;
    height: 200px;
    border: 1px solid black;
    border-radius: 8px;
    position: relative;
    font-weight: bold;
    color: #3c3c3c;

    // https://projects.verou.me/css3patterns/#cross-dots
    background:
    radial-gradient(black 3px, transparent 4px),
    radial-gradient(black 3px, transparent 4px),
    linear-gradient(#fff 4px, transparent 0),
    linear-gradient(45deg, transparent 74px, transparent 75px, #a4a4a4 75px, #a4a4a4 76px, transparent 77px, transparent 109px),
    linear-gradient(-45deg, transparent 75px, transparent 76px, #a4a4a4 76px, #a4a4a4 77px, transparent 78px, transparent 109px),
    #fff;
    background-size: 109px 109px, 109px 109px,100% 6px, 109px 109px, 109px 109px;
    background-position: 54px 55px, 0px 0px, 0px 0px, 0px 0px, 0px 0px;
  }

  .red {
    color: rgb(177, 1, 1);
  }

  .main-icon {
    font-size: 100px;
    width: 100%;
    height: 100%;
    vertical-align: middle;
    text-align: center;
    position: absolute;
    top: 45px
  }

  .flip {
    transform: scale(-1, -1);
  }

  .top-left {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .bottom-right {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
</style>