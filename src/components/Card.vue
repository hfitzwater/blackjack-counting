<template>
  <div :class="getCardClass()" style="vertical-align: top;">
    <div :class="{ card: true, red: cardDetails.suit.color === 'red' }">
      <template v-if="!isHole">
        <div class="top-left">
          <div>
            {{ this.cardDetails.designator.name }}
          </div>
          <div>
            {{ this.cardDetails.suit.icon }}
          </div>
        </div>
        <div class="main-icon">
          {{ this.cardDetails.suit.icon }}
        </div>
        <div class="bottom-right">
          <div>
            {{ this.cardDetails.suit.icon }}
          </div>
          <div class="flip">
            {{ this.cardDetails.designator.name }}
          </div>
        </div>
      </template>
    </div>
    <div v-if="!isHole && this.showCount" class="width-100 left" style="font-size: 1.2em; margin-bottom: 0.5em;">
      {{ Counter.lookupValue(this.cardDetails.designator, countStrat) }}
    </div>
  </div>
</template>

<script>
import Counter from '../game/counting';

export default {
  name: "Card",
  props: [
    "cardDetails",
    "isHole",
    "index"
  ],
  data() {
    return {
      Counter,
      countStrat: this.$store.state.options.countStrat,
      showCount: this.$store.state.options.showCount
    }
  },
  methods: {
    getCardClass() {
      let cardClass = 'inline-block';

      if( Number(this.index) ) {
        cardClass += ` index-${this.index}`;
      }

      return cardClass;
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

  @card-offset-top: 30px;
  @card-offset-left: -100px;

  .index-1 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top;
  }

  .index-2 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 2px;
  }

  .index-3 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 3px;
  }

  .index-4 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 4px;
  }

  .index-5 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 5px;
  }

  .index-6 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 6px;
  }

  .index-7 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 7px;
  }

  .index-8 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 8px;
  }

  .index-9 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 9px;
  }

  .index-10 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 10px;
  }

  .index-11 {
    margin-left: @card-offset-left;
    margin-top: @card-offset-top * 11px;
  }
</style>