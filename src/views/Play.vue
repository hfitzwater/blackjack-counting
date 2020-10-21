<template>
  <div class="play">
    <div class="dealer">
      <cv-loading style="position:absolute;" :active="dealerDrawing" overlay></cv-loading>
      <div class="center">
        <Card v-for="(card,index) of blackjack.cards" :key="index" :cardDetails="card" />
      </div>
      <div class="center" v-if="blackjack.cards[0].isHole">
        Dealer ({{ Blackjack.getHandValue([blackjack.cards[1]]) }})
      </div>
      <div class="center" v-else>
        Dealer ({{ Blackjack.getHandValue(blackjack.cards) }})
      </div>
    </div>
    <div class="players">
      <Player v-for="(player,index) of blackjack.players" :playerDetails="player" :botsPlaying="botsPlaying" :key="index" @continue="handleContinue" />
    </div>
    <br><br>
    <div class="center">
      <router-link to="/">
        Quit
      </router-link>
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
        if( humanIsDone && activeBotsStill.length ) {
          return this.waitForBots();
        } else if( humanIsDone ) {
          return this.finishHand();
        }
      });
    }
  },
  computed: {
    blackjack() {
      // TODO: change access
      return this.$store.state.blackjack.blackjack;
    }
  }
}
</script>

<style scoped lang="less">
  .dealer {
    position: relative;
    margin-bottom: 2em;
    padding: 1em;
  }
  .players {
    width: 100%;
    display: grid;
    grid-gap: 0.5rem;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
  }
</style>