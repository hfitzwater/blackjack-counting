<template>
  <div class="play-container">
    <div class="play">
      <div class="dealer">
        <cv-loading style="position:absolute;" :active="dealerDrawing" overlay></cv-loading>
        <div class="center">
          <Card v-for="(card, index) of dealerCards"
            :key="getKeyForCard(card)"
            :cardDetails="card"
            :isHole="card.isHole"
            :index="index"
          />
        </div>
        <div class="center status-line">
          Dealer ({{ getDealerScore() }}) ${{ blackjack.monies }}
        </div>
      </div>
      <div class="players">
        <Player v-for="(player) of blackjack.players"
          :playerDetails="player"
          :botsPlaying="botsPlaying"
          :waitingForPlayerReady="waitingForPlayerReady"
          :dealerDrawing="dealerDrawing"
          :payout="getPlayerPayout(player)"
          :key="getKeyForPlayer(player)"
          @continue="handleContinue"
        />
      </div>
      <br><br>
      <div class="global-action-bar">
        <cv-button @click="dealNextHand()" class="deal-button" kind="primary" v-if="waitingForPlayerReady">
          Deal
        </cv-button>
        <cv-button @click="toggleCount()" kind="secondary">
          Toggle Count
        </cv-button>
        <cv-button @click="quit()" kind="secondary" style="border-left: 1px solid #111;">
          Quit
        </cv-button>
      </div>
    </div>
    <Discard />
  </div>
</template>

<script>
import Blackjack from '../game/blackjack';
import Card from '../components/Card';
import Player from '../components/Player';
import Discard from '../components/Discard';
import { BLACKJACK_MUTATIONS } from '../store/modules/BlackjackStore';
import { OPTIONS_MUTATIONS } from '../store/modules/OptionsStore';
import { BotBrain, PLAYER_STATE } from '../game/blackjack';
import Counter from '../game/counting';

export default {
  name: "Play",
  components: {
    Card,
    Player,
    Discard
  },
  data() {
    return {
      Blackjack,
      botsPlaying: false,
      dealerDrawing: false,
      waitingForPlayerReady: false,
      payouts: {},
      showCount: this.$store.state.options.showCount,
      countStrat: this.$store.state.options.countStrat
    }
  },
  created() {
    const numDecks = Number(this.$store.state.options.gameType);
    const numExtraPlayers = Number(this.$store.state.options.numBots);

    let blackjack = new Blackjack({
      numDecks,
      numExtraPlayers
    });

    blackjack.deal();

    this.$store.commit(BLACKJACK_MUTATIONS.SET_BLACKJACK, blackjack);
  },
  mounted() {
    this.collectBotBets();
    this.collectPlayerBet();
    this.handleContinue();
  },
  methods: {
    getKeyForCard(card) {
      return `${card.designator.name} of ${card.suit.name}`;
    },
    getKeyForPlayer(player) {
      if( player.isHuman ) return 'Human';
      return player.name;
    },
    async handleContinue() {
      await this.waitForBots();
    },
    async finishHand() {
      Object.assign(this.dealerCards[0], {
        isHole: false
      });

      let dealerScore = Blackjack.getHandValue(this.dealerCards);
      while(dealerScore < 17) {
        await this.dealerDraw();
        dealerScore = Blackjack.getHandValue(this.dealerCards);
      }

      this.dealerDrawing = false;
      return this.payout();
    },
    async dealerDraw() {
      this.dealerDrawing = true;
      let dealerScore = Blackjack.getHandValue(this.dealerCards);
      if( dealerScore <= 17 ) {
        return new Promise((res) => {
          setTimeout(() => {
            this.blackjack.hitDealer();
            res();
          }, 2000);
        });
      }
    },
    quit() {
      this.$router.push('/');
    },
    clearPayouts() {
      this.payouts = {};
    },
    dealNextHand() {
      this.collectBotBets();
      this.collectPlayerBet();
      this.clearPayouts();

      this.waitingForPlayerReady = false;

      const newState = this.blackjack.deal();
      this.$store.commit(BLACKJACK_MUTATIONS.SET_BLACKJACK, newState);
      this.handleContinue();
    },
    toggleCount() {
      this.$store.commit(OPTIONS_MUTATIONS.SET_SHOW_COUNT, !this.$store.state.options.showCount);
    },
    payout() {
      this.payouts = this.blackjack.payout();
      this.waitingForPlayerReady = true;
    },
    collectBotBets() {
      const activeBots = this.blackjack.players.filter(p => {
        return !p.isHuman && p.state === PLAYER_STATE.ACTIVE;
      });

      activeBots.forEach(bot => {
        const currentCount = Counter.countCards(this.getExposedCards(), this.countStrat);
        const botBet = BotBrain.getBet(bot, currentCount);
        bot.monies -= botBet;
        bot.bet = botBet;
      });
    },
    collectPlayerBet() {
      const player = this.blackjack.players[0];
      player.monies -= player.bet;
    },
    async waitForBots() {
      let tasks = [];
      this.botsPlaying = true;

      const activeBots = this.blackjack.players.filter(p => {
        return !p.isHuman && p.state === PLAYER_STATE.ACTIVE;
      });

      const start = activeBots.length - 1;
      for(let i=start; i>=0; i--) {
        const botTask = () => {
          return new Promise((res) => {
            const vm = this;

            const bot = activeBots[i];
            bot.thinking = true;

            setTimeout(() => {
              const bot = activeBots[i];
              let botScore = Blackjack.getHandValue(bot.cards);

              const currentCount = Counter.countCards(this.getExposedCards(), this.countStrat);
              if( BotBrain.willHit(bot, botScore, currentCount, this.blackjack) ) {
                vm.blackjack.hitPlayer(bot);
              } else {
                bot.state = PLAYER_STATE.STAND;
              }

              botScore = Blackjack.getHandValue(bot.cards);

              if( botScore === 21 ) {
                bot.state = PLAYER_STATE.BLACKJACK;
              } else if( botScore > 21 ) {
                bot.state = PLAYER_STATE.BUST;
              }

              bot.thinking = false;

              res(bot);
            }, 2000);
          });
        };

        tasks.push(botTask);
      }

      return tasks.reduce((acc, task) => {
        return acc.then(() => {
          return new Promise((res) => {
            setTimeout(() => {
              return task().then(() => res());
            }, 1200 );
          })
        });
      }, Promise.resolve())
      .then(() => {
        this.botsPlaying = false;
        
        const human = this.blackjack.players.find(p => p.isHuman);
        const humanIsDone = human.state !== PLAYER_STATE.ACTIVE;
        const activeBotsStill = this.blackjack.players.filter(p => !p.isHuman && p.state === PLAYER_STATE.ACTIVE);

        if( humanIsDone && activeBotsStill.length > 0 ) {
          return this.waitForBots();
        } else if( humanIsDone ) {
          return this.finishHand();
        }
      });
    },
    getExposedCards() {
      return this.blackjack.players.reduce((acc, player) => {
        return acc.concat(player.cards);
      }, this.blackjack.discard);
    },
    getPlayerPayout(player) {
      const payout = this.payouts[player.index];
      if( payout ) {
        return payout;
      }

      return null;
    },
    getDealerScore() {
      if( this.revealHole || this.dealerDrawing ) {
        return Blackjack.getHandValue(this.dealerCards);
      } else {
        return Blackjack.getHandValue([this.dealerCards[1]])
      }
    }
  },
  computed: {
    dealerCards() {
      return this.blackjack.cards;
    },
    revealHole() {
      return !this.dealerCards[0].isHole || this.dealerDrawing;
    },
    blackjack() {
      return this.$store.state.blackjack.blackjack;
    }
  }
}
</script>

<style scoped lang="less">
  .play {
    min-width: 85%;
    color: #3c3c3c;

    background: rgb(107,107,107);
    background: linear-gradient(0deg, rgba(107,107,107,1) 0%, rgba(221,221,221,1) 54%);

    flex: 1 1 auto;
  }
  .dealer {
    position: relative;
    margin-bottom: 2em;
    padding: 1em;
  }
  .dealer-notif {
    position: relative;
    margin: auto;
    z-index: 100;
    top: 170px;
  }
  .players {
    width: 100%;
    display: flex;
    flex-direction: row;

    > * {
      flex: 1 1 auto;
      text-align: center;
    }
  }
  .deal-button {
    background-color: #ebb33b;
    color: #3c3c3c;
  }
  .play-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    margin: auto;
  }
  .global-action-bar {
    z-index: 101;
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    flex-direction: row;
    background-color: #efefef;

    > button {
      flex: 1 1 auto;
      max-width: none;
    }
  }
</style>