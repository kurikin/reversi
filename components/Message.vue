<template>
  <div>
    <div v-if="data.roomInfo.status === 'end'" class="message">
      {{ resultText() }}
    </div>
    <div v-else-if="pass && myId" class="message">
      あなたは置く場所がないのでパスしました
    </div>
    <div v-else-if="pass && !myId" class="message">
      相手は置ける場所がありません
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { countDisks } from "~/scripts/reversi";
export default {
  computed: {
    pass() {
      return this.data.roomInfo.pass !== "";
    },
    myId() {
      return this.data.roomInfo.pass === this.data.myId;
    },
    ...mapState(["data"]),
    ...mapGetters(["board", "myTurn", "isHost", "myDisk", "rivalId"]),
    ...mapActions(["listener"]),
  },
  methods: {
    resultText() {
      const { whiteCount, blackCount } = countDisks(this.board);

      const handicap = this.data.roomInfo.handicap;

      const blackWin =
        blackCount > whiteCount ||
        (blackCount === whiteCount && handicap === 1);
      const whiteWin = whiteCount > blackCount;

      const youWin = (this.isHost && blackWin) || (!this.isHost && whiteWin);

      if (blackCount === whiteCount && handicap !== 1) return "引き分けです";
      return youWin ? "あなたの勝ちです" : "あなたの負けです";
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  height: 30px;
  text-align: center;
  margin-top: 30px;
  font-size: 24px;
}
</style>
