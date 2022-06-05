<template>
  <div
    class="square"
    :class="{ red: redActive }"
    @click="canPut() ? clickHandle() : addClass()"
  >
    <div
      :class="[
        'disk-container',
        { flipped: disk !== myDisk && disk !== 'none' },
        { transparent: disk === 'none' },
      ]"
    >
      <div :class="['white-disk', { 'is-default': myDisk === 'white' }]" />
      <div :class="['black-disk', { 'is-default': myDisk === 'black' }]" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import deepcopy from 'deepcopy';
import {
  getFlipPositions,
  flip,
  checkPutPosition,
  pass,
} from '~/scripts/reversi';
import { setRoomInfo } from '~/scripts/repository';

export default {
  props: {
    disk: {
      type: String,
      default: 'none',
    },
    pos: {
      type: Object,
      default: () => ({
        x: -1,
        y: -1,
      }),
    },
  },
  data() {
    return {
      redActive: false,
    };
  },
  computed: {
    ...mapState(['data']),
    ...mapGetters([
      'board',
      'myTurn',
      'isHost',
      'myDisk',
      'rivalId',
      'flipState',
    ]),
    backColor() {
      if (this.disk === 'white') {
        return 'black';
      } else if (this.disk === 'black') {
        return 'white';
      } else {
        return 'none';
      }
    },
  },
  methods: {
    canPut() {
      const exp =
        this.data.roomInfo.turn === this.data.myId &&
        this.board[this.pos.y][this.pos.x] === 'none';
      return exp ? checkPutPosition(this.board, this.pos, this.myDisk) : false;
    },
    addClass() {
      this.redActive = true;
      setTimeout(() => {
        this.redActive = false;
      }, 500);
    },
    clickHandle() {
      if (!(this.myTurn && this.board[this.pos.y][this.pos.x] === 'none'))
        return;

      const flipList = getFlipPositions(this.board, this.pos, this.myDisk);
      flipList.push(this.pos);

      const newData = deepcopy(this.data);

      newData.roomInfo.board = flip(this.board, flipList, this.myDisk);
      newData.roomInfo.turn = this.rivalId;
      newData.roomInfo.pass = '';

      if (
        pass(newData.roomInfo.board, 'black') &&
        pass(newData.roomInfo.board, 'white')
      ) {
        [newData.roomInfo.status, newData.roomInfo.turn] = ['end', 'none'];
      }

      setRoomInfo(newData.roomId, newData.roomInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
$red: #fa5252;
$blue: hsla(194, 80%, 44%, 0.85);

.square {
  font-weight: bold;
  padding: 0;
  width: 100%;
  cursor: pointer;
  display: inline-block;
  background: $blue;

  &.red {
    transition: 0.5s;
    background: $red;
  }

  .disk-container {
    width: 100%;
    text-align: center;
    margin: auto;
    perspective: 10px;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    transform: rotateY(0);

    &::before {
      content: '';
      padding-top: 100%;
      display: block;
    }

    &.transparent > div {
      background-image: none !important;
      box-shadow: none !important;
    }

    &.flipped {
      transform: rotateY(180deg);
    }
  }

  .white-disk,
  .black-disk {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: 90%;
    width: 90%;
    border-radius: 50%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
  }

  .white-disk {
    background-image: linear-gradient(#ebe9e9 0%, #ebebeb 100%);
    box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.5),
      0 2px 2px rgba(0, 0, 0, 0.19);
    transform: rotateY(180deg);

    &.is-default {
      transform: rotateY(0);
    }
  }

  .black-disk {
    background-image: linear-gradient(#3b3b3b 0%, #1a1919 100%);
    box-shadow: inset 0 2px 0 #000, 0 2px 2px rgba(0, 0, 0, 0.19);
    transform: rotateY(180deg);

    &.is-default {
      transform: rotateY(0);
    }
  }
}
</style>
