<template>
  <div class="background">
    <div class="container">
      <h1 class="title">欲しいハンデを選択してください</h1>
      <div class="handicap-grid">
        <button class="button handicap" @click="buttonClicked(0)">
          ハンデ無し
        </button>
        <button class="button handicap" @click="buttonClicked(1)">
          引き分け勝ち
        </button>
        <button class="button handicap" @click="buttonClicked(2)">1子局</button>
        <button class="button handicap" @click="buttonClicked(3)">2子局</button>
        <button class="button handicap" @click="buttonClicked(4)">3子局</button>
        <button class="button handicap" @click="buttonClicked(5)">4子局</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import deepcopy from "~/node_modules/deepcopy";
import { setRoomInfo } from "~/scripts/repository";
import { applyHandicap } from "~/scripts/reversi";

export default {
  data() {
    return {
      array: [0, 1, 2, 3, 4, 5],
    };
  },
  computed: {
    ...mapState(["data"]),
    ...mapGetters(["isHost"]),
  },
  mounted() {
    this.subscribe();
  },
  beforeDestroy() {
    this.unsbscribe();
  },
  methods: {
    buttonClicked(level) {
      const oldData = this.data;
      const newData = deepcopy(this.data);

      if (this.isHost) {
        newData.roomInfo.hostHandicap = level;
      } else {
        newData.roomInfo.guestHandicap = level;

        const handicap = newData.roomInfo.hostHandicap - level;
        newData.roomInfo.handicap = Math.abs(handicap);

        if (handicap < 0) {
          newData.roomInfo.host = oldData.roomInfo.guest;
          newData.roomInfo.guest = oldData.roomInfo.host;
          newData.roomInfo.hostUserName = oldData.roomInfo.guestUserName;
          newData.roomInfo.guestUserName = oldData.roomInfo.hostUserName;
          newData.roomInfo.turn = oldData.roomInfo.guest;
          newData.roomInfo.guestHandicap = oldData.roomInfo.hostHandicap;
          newData.roomInfo.hostHandicap = newData.roomInfo.guestHandicap;
        }

        const board = applyHandicap(newData.roomInfo.handicap);
        newData.roomInfo.board = board;
      }

      setRoomInfo(newData.roomId, newData.roomInfo);
      this.$router.push("/game");
    },
    ...mapActions(["subscribe", "unsbscribe"]),
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  color: white;
  text-align: center;
  margin-bottom: 48px;

  @include mq(sm) {
    font-size: 30px;
  }

  @include mq() {
    font-size: 36px;
    margin-bottom: 80px;
  }
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 0 20px;
  max-width: 1200px;
  height: 100vh;
}

.background {
  background-image: url(./static/background.jpg);
  background-position: 50%;
}
.handicap-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @include mq() {
    gap: 48px;
  }
}
</style>
