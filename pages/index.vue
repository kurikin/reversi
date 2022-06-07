<template>
  <div class="background">
    <div class="container">
      <h2 class="title">オセロ</h2>

      <div class="create">
        <input
          id="userName"
          type="text"
          class="user-name-input"
          placeholder="ユーザー名"
          @change="setUserName"
        />
        <input
          id="createRoomButton"
          type="button"
          class="button"
          value="ルームを作成"
          @click="createRoom"
        />
      </div>

      <div class="enter">
        <div class="enter-input-box">
          <input
            id="userName"
            type="text"
            class="user-name-input"
            placeholder="ユーザー名"
            @change="setUserName"
          />
          <input
            id="roomId"
            type="text"
            class="room-id-input"
            placeholder="ルームID"
            @change="setInputRoomId"
          />
        </div>
        <input
          id="enterRoomButton"
          type="button"
          class="button"
          value="ルームに入る"
          @click="enterRoom"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { initBoard, createUserId, createRoomId } from '~/scripts/reversi';
import { getRoomInfo, setRoomInfo } from '~/scripts/repository';
export default {
  data() {
    return {
      inputRoomId: '',
      userName: '',
    };
  },
  computed: {
    ...mapState(['data']),
  },
  methods: {
    ...mapMutations(['setData', 'setHost']),
    generateGuestId(hostId) {
      for (let i = 0; i < 2; i++) {
        const guestId = createUserId();
        if (guestId !== hostId) return guestId;
      }
    },
    setInputRoomId(event) {
      this.inputRoomId = event.target.value;
    },
    setUserName(event) {
      this.userName = event.target.value;
    },
    errorHandle(message) {
      alert(message);
    },
    async createRoom() {
      if (this.userName === '') {
        this.errorHandle('ユーザー名を入力してください');
        return;
      }

      const roomId = createRoomId();
      const roomInfo = await getRoomInfo(roomId);

      if (roomInfo) {
        await this.createRoom();
        return;
      }

      const myId = createUserId();
      const newRoomInfo = {
        host: myId,
        guest: '',
        hostUserName: this.userName,
        guestUserName: '',
        hostHandicap: 0,
        guestHandicap: 0,
        handicap: 0,
        turn: 'none',
        board: initBoard(),
        status: '',
        pass: '',
      };

      await setRoomInfo(roomId, newRoomInfo);
      this.setData({
        roomId,
        myId,
        roomInfo: newRoomInfo,
      });
      this.$router.push('/handicap');
    },
    async enterRoom() {
      if (this.inputRoomId === '') {
        this.errorHandle('idを入力してください');
        return;
      } else if (this.userName === '') {
        this.errorHandle('ユーザー名を入力してください');
        return;
      }

      const roomId = this.inputRoomId;
      const roomInfo = await getRoomInfo(this.inputRoomId);
      if (!roomInfo) {
        this.errorHandle('入力された部屋idは存在しません');
        return;
      }
      const guestId = this.generateGuestId(roomInfo.host);

      if (!guestId) {
        this.errorHandle('もう一度お試しください');
      } else {
        roomInfo.guest = guestId;
        roomInfo.guestUserName = this.userName;
        roomInfo.turn = roomInfo.host;
        roomInfo.status = 'running';

        await setRoomInfo(roomId, roomInfo);
        this.setData({
          roomId,
          myId: guestId,
          roomInfo,
        });
        this.$router.push('/handicap');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$buttonColor: #dee8e9;

.background {
  background-image: url(./static/background.jpg);
  background-position: 50%;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
}

.title {
  color: white;
  font-size: 60px;
  margin-bottom: 60px;
}

.create {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;

  @include mq() {
    margin-bottom: 64px;
  }
}

.enter-input-box {
  display: flex;
  flex-direction: column;
  gap: 10px;

  @include mq() {
    flex-direction: row;
  }
}

.enter {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;

  @include mq() {
    margin-bottom: 64px;
  }
}

.room-id-input,
.user-name-input {
  font-size: 16px;
  display: inline-block;
  border-radius: 4px;
  border: 1px solid grey;
  padding: 10px 16px;
  width: 140px;

  &:focus {
    outline: 0;
    border: 1px solid #3498db;
  }

  @include mq(xs) {
    width: 190px;
  }

  @include mq() {
    font-size: 20px;
  }
}
</style>
