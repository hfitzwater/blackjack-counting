<template>
  <div class="discard" v-if="showCount">
    <div>
      <div class="width-100" style="margin-bottom: 2em;">
        <cv-data-table :columns="['Running Count']">
          <template slot="data">
            <cv-data-table-row>
              <cv-data-table-cell>
                <span :class="{ red: Counter.countCards(getExposedCards(), countStrat) < 0 }">
                  {{ Counter.countCards(getExposedCards(), countStrat) }}
                </span>
              </cv-data-table-cell>
            </cv-data-table-row>
          </template>
        </cv-data-table>

        <cv-data-table :columns="['Bust Chance']">
          <template slot="data">
            <cv-data-table-row>
              <cv-data-table-cell>
                <span :class="{ red: chanceToBust >= 50 }">
                  {{ chanceToBust }}%
                </span>
              </cv-data-table-cell>
            </cv-data-table-row>
          </template>
        </cv-data-table>

        <div class="container theme--g100" style="margin: 2em 0.5em 0em 0.5em;">
          <!-- <ccv-pie-chart :data='deckChartData' :options='options'></ccv-pie-chart> -->
          <ccv-simple-bar-chart :data='deckChartData' :options='options'></ccv-simple-bar-chart>
        </div>
      </div>
    </div>
    <cv-data-table :columns="['Discarded']">
      <template slot="data">
        <cv-data-table-row>
          <cv-data-table-cell>
            <span style="color: #161616">
              {{ blackjack.discard.length }}
            </span>
          </cv-data-table-cell>
        </cv-data-table-row>
      </template>
    </cv-data-table>
    <div style="margin-bottom: 3em; margin-top: 1.5em;">
      <div v-for="card of blackjack.discard" :key="getKeyForCard(card)">
        <Card :cardDetails="card" />
      </div>
    </div>
  </div>
</template>

<script>
import Card from '../components/Card';
import Counter from '../game/counting';

export default {
  name: "Discard",
  components: {
    Card
  },
  data() {
    return {
      Counter,
      deckDataColumns: [
        "Bust Chance",
        "Running Count",
        "Discarded"
      ],
      countStrat: this.$store.state.options.countStrat,
      options: {
          "axes": {
              "bottom": {
                  "mapsTo": "value",
                  "scaleType": "linear"
              },
              "left": {
                  "mapsTo": "group",
                  "scaleType": "labels"
              }
          },
          "legend": {
            "position": "top",
            "alignment": "center",
            "order": ['1','2','3','4','5','6','7','8','9','10'],
            "enabled": true
          },
          "height": "250px"
      }
    };
  },
  methods: {
    getKeyForCard(card) {
      return `${card.designator.name} of ${card.suit.name} in Deck:${card.effectiveDeckNumber}`;
    },
    getExposedCards() {
      return this.blackjack.players.reduce((acc, player) => {
        return acc.concat(player.cards);
      }, this.blackjack.discard);
    },
  },
  computed: {
    blackjack() {
      return this.$store.state.blackjack.blackjack;

    },
    deckChartData() {
      return this.blackjack.getDeckChartData();
    },
    chanceToBust() {
      const chance = this.blackjack.getChanceToBust(0);
      return chance;
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
    background-color: white;
  }

  td {
    span.red {
      color: #b10101
    }

    text-align: center;
    color: green;
    font-weight: bold;
  }
</style>