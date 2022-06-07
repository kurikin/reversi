<template>
  <div class="background">
    <div class="container">
      <!-- 盤面 -->
      <div class="board">
        <Square
          v-for="pos in array"
          :key="`${pos.x}${pos.y}`"
          :pos="pos"
          :disk="board[pos.y][pos.x]"
        />
      </div>

      <div class="turn">{{ turnText() }}</div>

      <!-- 対局情報 -->
      <div class="match-info">
        <div class="room-id">ルーム: {{ data.roomId }}</div>
        <div class="disk-count">{{ countDisksText() }}</div>
        <div class="your-color">あなたの色: {{ colorInJapanese(myDisk) }}</div>
        <div class="rival">対戦相手: {{ rivalText(rivalId) }}</div>
        <Message />
      </div>

      <div class="button-box">
        <button class="button" @click="backHome()">ホームに戻る</button>
        <button
          v-show="data.roomInfo.status === 'end'"
          class="button again"
          @click="gameAgain"
        >
          もう一度対戦
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import deepcopy from 'deepcopy';
import { mapState, mapGetters, mapActions } from 'vuex';
import { getDatabase, ref, set } from 'firebase/database';
import { initBoard, pass, countDisks } from '~/scripts/reversi';
import Message from '~/components/Message.vue';
import { setRoomInfo } from '~/scripts/repository';
import { BOARD_RANGE } from '~/assets/constants';

export default {
  components: { Message },
  data() {
    return {
      array: BOARD_RANGE.flatMap((x) =>
        BOARD_RANGE.flatMap((y) => {
          return { x, y };
        })
      ),
      newData: null,
    };
  },
  computed: {
    ...mapState(['data']),
    ...mapGetters(['board', 'myTurn', 'isHost', 'myDisk', 'rivalId']),
  },
  watch: {
    '$store.state.data': {
      handler() {
        this.init();
      },
      immediate: true,
    },
  },
  mounted() {
    this.subscribe();
    if (this.data.myId === this.data.roomInfo.host)
      window.addEventListener('unload', this.hostDisconnect);
    else window.addEventListener('unload', this.guestDisconnect);
  },
  beforeDestroy() {
    this.unsbscribe();
  },
  methods: {
    init() {
      const newData = deepcopy(this.data);
      if (this.myTurn && pass(this.board, this.myDisk)) {
        newData.roomInfo.turn = this.rivalId;
        newData.roomInfo.pass = this.data.myId;
        setRoomInfo(newData.roomId, newData.roomInfo);
      }
    },
    countDisksText() {
      const { whiteCount, blackCount } = countDisks(this.board);
      return `黒: ${blackCount} vs 白: ${whiteCount}`;
    },
    turnText() {
      if (this.data.roomInfo.turn === 'none') return '';
      return this.data.roomInfo.turn === this.data.myId
        ? 'あなたのターンです'
        : '相手のターンです';
    },
    rivalText() {
      if (this.data.roomInfo.turn === 'none') return '待機中';
      return this.data.roomInfo.host === this.data.myId
        ? this.data.roomInfo.guestUserName
        : this.data.roomInfo.hostUserName;
    },
    gameAgain() {
      const newData = deepcopy(this.data);
      newData.roomInfo.board = initBoard();
      newData.roomInfo.turn = this.data.roomInfo.host;
      newData.roomInfo.status = 'running';
      setRoomInfo(newData.roomId, newData.roomInfo);
    },
    colorInJapanese(myDisk) {
      return myDisk === 'black' ? '黒' : '白';
    },
    hostDisconnect() {
      const db = getDatabase();
      const roomPath = ref(db, `rooms/${this.data.roomId}`);
      set(roomPath, null);
    },
    guestDisconnect() {
      const newData = deepcopy(this.data);
      newData.roomInfo.turn = 'none';
      newData.roomInfo.guest = '';
      newData.roomInfo.guestUserName = '';
      newData.roomInfo.status = 'guest disconnected';
      setRoomInfo(newData.roomId, newData.roomInfo);
    },
    backHome() {
      if (confirm('対局を終了しますか？')) {
        if (this.data.myId === this.data.roomInfo.host) this.hostDisconnect();
        else this.guestDisconnect();

        this.$router.push('/');
      }
    },
    ...mapActions(['subscribe', 'unsbscribe']),
  },
};
</script>

<style lang="scss" scoped>
.background {
  background-image: url(./static/background.jpg);
  background-position: 50%;
}

.container {
  display: grid;
  align-content: center;
  grid-template-columns: 1fr 1.1fr;
  grid-template-rows: auto auto auto;
  margin: 0 auto;
  padding: 0 20px;
  max-width: 1200px;
  row-gap: 48px;
  align-items: center;
  justify-items: flex-start;
  height: 100vh;

  .board {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    width: 100%;
    gap: 8px;
    grid-column: 2;
    grid-row: -1 / 1;
  }

  .match-info {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
    flex: 1;
    gap: 20px;
    grid-column: 1;
    grid-row: 2;
  }

  .button-box {
    display: flex;
    flex-direction: column;
    gap: 20px;
    grid-column: 1;
    grid-row: 3;
    align-self: flex-end;
  }
}

.turn {
  color: white;
  font-size: 48px;
  grid-column: 1;
  grid-row: 1;
  align-self: flex-start;
}
</style>
