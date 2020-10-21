<template>
  <div class="play-container">
    <div class="play">
      <div class="width-100 center">
        <h1>Blackjack</h1>
      </div>
      <div class="dealer">
        <cv-loading style="position:absolute;" :active="dealerDrawing" overlay></cv-loading>
        <div class="center">
          <Card v-for="(card, index) of dealerCards" :key="getKeyForCard(card)" :cardDetails="card" :index="index" />
        </div>
        <div class="center" v-if="dealerCards[0].isHole">
          Dealer ({{ Blackjack.getHandValue([dealerCards[1]]) }})
        </div>
        <div class="center" v-else>
          Dealer ({{ Blackjack.getHandValue(dealerCards) }})
        </div>
      </div>
      <div class="players">
        <Player v-for="(player) of blackjack.players" :playerDetails="player" :botsPlaying="botsPlaying" :key="getKeyForPlayer(player)" @continue="handleContinue" />
      </div>
      <br><br>
      <div class="center">
        
        <router-link to="/">
          Quit
        </router-link>
      </div>
    </div>
    <div class="discard">
      <div class="width-100 center">
        <h1>Discard</h1>
      </div>
      <div v-for="card of blackjack.discard" :key="getKeyForCard(card)">
        <Card :cardDetails="card" />
      </div>
    </div>
  </div>
</template>

<script>
import Blackjack from '../game/blackjack';
import Card from '../components/Card';
import Player from '../components/Player';
import { BLACKJACK_MUTATIONS } from '../store/modules/BlackjackStore';
import { PLAYER_STATE } from '../game/blackjack';

export default {
  name: "Play",
  components: {
    Card,
    Player
  },
  data() {
    return {
      Blackjack,
      botsPlaying: false,
      dealerDrawing: false
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
      this.blackjack.cards[0].isHole = false;

      let dealerScore = Blackjack.getHandValue(this.blackjack.cards);
      while(dealerScore < 17) {
        await this.dealerDraw();
        dealerScore = Blackjack.getHandValue(this.blackjack.cards);
      }

      this.dealerDrawing = false;
      return this.payout();
    },
    async dealerDraw() {
      this.dealerDrawing = true;
      let dealerScore = Blackjack.getHandValue(this.blackjack.cards);
      if( dealerScore < 17 ) {
        return new Promise((res) => {
          setTimeout(() => {
            this.blackjack.hitDealer();
            res();
          }, 3000);
        });
      }
    },
    payout() {
      setTimeout(() => {
        const newState = this.blackjack.deal();
        this.$store.commit(BLACKJACK_MUTATIONS.SET_BLACKJACK, newState);
        this.handleContinue();
      }, 5000 );
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

              if( botScore < 16 ) {
                vm.blackjack.hitPlayer(bot);
              } else {
                bot.state = PLAYER_STATE.STAY;
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
        const activeBotsStill = activeBots.filter(b => b.state === PLAYER_STATE.ACTIVE);

        console.log('activeBotsStill', activeBotsStill);

        if( humanIsDone && activeBotsStill.length > 0 ) {
          return this.waitForBots();
        } else if( humanIsDone ) {
          return this.finishHand();
        }
      });
    }
  },
  computed: {
    dealerCards() {
      return this.blackjack.cards;
    },
    blackjack() {
      // TODO: change access
      return this.$store.state.blackjack.blackjack;
    }
  }
}
</script>

<style scoped lang="less">
  .play {
    width: 100%;
    background-color: #fefefe;
  }
  .dealer {
    position: relative;
    margin-bottom: 2em;
    padding: 1em;
  }
  .players {
    width: 100%;
    display: flex;
    flex-direction: row;
    // justify-items: center;

    > * {
      flex: 1 1 auto;
      text-align: center;
    }
  }
  .play-container {
    display: grid;
    grid-gap: 0.5rem;
    grid-template-columns: 5fr 1fr;
    justify-items: center;
    height: 100%;
    background-color: #3c3c3c;
  }
  .discard {
    height: 100%;
    width: 100%;
    background-color: #fefefe;
    overflow-y: scroll;
    text-align: center;
  }
</style>