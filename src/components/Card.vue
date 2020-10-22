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
    <div v-if="!isHole && this.showCount" class="card-count-value">
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
      countStrat: this.$store.state.options.countStrat
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
  },
  computed: {
    showCount() {
      return this.$store.state.options.showCount
    }
  }
}
</script>

<style scoped lang="less">
  .card {
    cursor: pointer;
    margin: 4px;
    font-size: 12px;
    width: 85px;
    height: 120px;
    border: 1px solid #bbb;
    border-radius: 4px;
    position: relative;
    font-weight: bold;
    color: #3c3c3c;
    background: rgb(244,244,244);
    background: linear-gradient(90deg, rgba(244,244,244,1) 17%, rgba(200,200,200,1) 56%, rgba(244,244,244,1) 79%);

    &.red {
      color: rgb(177, 1, 1);
    }

    .main-icon {
      font-size: 64px;
      width: 100%;
      height: 100%;
      vertical-align: middle;
      text-align: center;
      position: absolute;
      top: 22px
    }

    .flip {
      transform: scale(-1, -1);
    }

    .top-left {
      position: absolute;
      top: 6px;
      left: 6px;
    }

    .bottom-right {
      position: absolute;
      bottom: 6px;
      right: 6px;
    }
  }

  .card-count-value {
    position: relative;
    top: -20px;
    left: -8px;
    font-size: 16px;
    line-height: 30px;
    width: 30px;
    height: 30px;
    background-color: #3c3c3c;
    color: #efefef;
    font-weight: 900;
    border-radius: 50%;
  }

  @card-offset-top: 12px;
  @card-offset-left: -42px;

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