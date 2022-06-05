<template>
  <div class="square" @click="clickHandle()">
    <div
      :class="[
        'disk-container',
        { flipped: disk === 'black' },
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
    roomId: {
      type: String,
      default: '0000',
    },
    room: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState(['data']),
    ...mapGetters(['myDisk'])
  },
  methods: {
    clickHandle() {
      const newData = deepcopy(this.room);

      const color = newData.board[this.pos.y][this.pos.x];
      if (color === 'black') {
        newData.board[this.pos.y][this.pos.x] = 'white';
      } else if (color === 'white') {
        newData.board[this.pos.y][this.pos.x] = 'none';
      } else {
        newData.board[this.pos.y][this.pos.x] = 'black';
      }
      setRoomInfo(this.roomId, newData);
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
  border: 1px solid #000;
  width: 100%;
  cursor: pointer;
  display: inline-block;
  background: $blue;

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
    // background-color: white;
    box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.5),
      0 2px 2px rgba(0, 0, 0, 0.19);
    // border-bottom: solid 2px #b5b5b5;
    transform: rotateY(0);
  }

  .black-disk {
    background-image: linear-gradient(#3b3b3b 0%, #1a1919 100%);
    // background-color: black;
    box-shadow: inset 0 2px 0 #000, 0 2px 2px rgba(0, 0, 0, 0.19);
    // border-bottom: solid 2px #000;
    transform: rotateY(180deg);
  }
}
</style>
