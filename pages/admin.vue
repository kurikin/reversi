<template>
  <div class="background">
    <div v-if="isLogined">
      <div class="container">
        <nav class="header">
          <h1 class="title">管理画面</h1>
          <h2 class="menu" @click="curpage = 0">対局情報</h2>
          <h2 class="menu" @click="curpage = 1">パスワード変更</h2>
          <h2 class="menu" @click="goHome">ホームに戻る</h2>
        </nav>
        <div v-if="curpage === 0">
          <h1 class="status">
            盤面
            {{ rooms !== null ? Object.keys(rooms).length : 0 }}局対局中です
          </h1>
          <ul class="board-list">
            <li v-for="(room, index) in rooms" :key="index">
              <div class="list-item">
                <div class="room-info">
                  <div class="room-id-info">
                    <h2>{{ index }}</h2>
                    <button class="button" @click="removeRoom(index)">
                      消去
                    </button>
                  </div>
                  <h3>状態: {{ room.status ? room.status : '-' }}</h3>
                  <h3>
                    ホスト:
                    {{ room.hostUserName ? room.hostUserName : '-' }} ({{
                      room.host ? room.host : '-'
                    }})
                    <button
                      class="button"
                      @click="changeUserName(index, 'host')"
                    >
                      名前の変更
                    </button>
                  </h3>
                  <h3>
                    ゲスト:
                    {{ room.guestUserName ? room.guestUserName : '-' }} ({{
                      room.guest ? room.guest : '-'
                    }})<button
                      class="button"
                      @click="changeUserName(index, 'guest')"
                    >
                      名前の変更</button
                    ><button class="button" @click="removeUser(index, 'guest')">
                      消去
                    </button>
                  </h3>
                  <h3>
                    ターン:
                    {{
                      room.turn
                        ? room.turn == room.host
                          ? room.hostUserName
                          : room.guestUserName
                        : '-'
                    }}
                    ({{ room.turn ? room.turn : '-' }})<button
                      class="button"
                      @click="
                        changeTurn(
                          index,
                          room.host == room.turn ? room.guest : room.host
                        )
                      "
                    >
                      変更
                    </button>
                  </h3>
                </div>
                <div class="board">
                  <AdminSquare
                    v-for="pos in array"
                    :key="`${pos.x}${pos.y}`"
                    :pos="pos"
                    :disk="room.board[pos.y][pos.x]"
                    :room="room"
                    :room-id="index"
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="container expand">
        <div v-if="curpage === 1">
          <h1>パスワード変更</h1>
          <p>現在のパスワード:<input ref="curpass" type="password" /></p>
          <p>変更後のパスワード:<input ref="newpass" type="password" /></p>
          <p>パスワード（再入力）:<input ref="verifypass" type="password" /></p>
          <p ref="passStat"></p>
          <button class="button" @click="changePassword()">保存</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="container expand">
        <div class="login">
          <h1 class="title">管理画面</h1>
          <input ref="password" class="password-input" type="password" />
          <div class="login-button-box">
            <button class="button" @click="checkPassword()">ログイン</button>
            <button class="button" @click="goHome()">ホームに戻る</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get, set, onValue } from 'firebase/database';
import AdminSquare from '~/components/AdminSquare.vue';
import { BOARD_RANGE } from '~/assets/constants';
export default {
  components: { AdminSquare },
  data() {
    return {
      array: BOARD_RANGE.flatMap((x) =>
        BOARD_RANGE.flatMap((y) => {
          return { x, y };
        })
      ),
      newId: 0,
      isLogined: false,
      curpage: 0,
    };
  },
  created() {
    const db = getDatabase();
    const usersPath = ref(db, 'users/');
    onValue(usersPath, (snapshot) => {
      this.users = snapshot.val();
    });
    const roomPath = ref(db, 'rooms/');
    onValue(roomPath, (snapshot) => {
      this.rooms = snapshot.val();
    });
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    changeRoomId(roomId) {
      const newId = window.prompt('ルームID(4桁)を入力してください');
      if (!newId || newId.length !== 4) {
        alert('4桁の数字を入力してください');
        return;
      }
      if (Object.keys(this.rooms).includes(newId)) {
        alert('ルームIDが重複しています');
        return;
      }
      const db = getDatabase();
      const roomIdPath = ref(db, `rooms/${roomId}`);
      get(roomIdPath).then((snapshot) => {
        const data = snapshot.val();

        const newroomPath = ref(db, `rooms/${newId}`);
        set(newroomPath, data);
      });

      set(roomIdPath, null);
    },
    removeRoom(roomId) {
      if (window.confirm('本当に消去しますか？')) {
        const db = getDatabase();
        const roomPath = ref(db, `rooms/${roomId}`);
        set(roomPath, null);
      }
    },
    changeUserName(roomId, userType) {
      const newUserName = window.prompt('新しい名前を入力してください');
      if (!newUserName) {
        alert('名前を入力してください');
        return;
      }

      const db = getDatabase();
      const roomIdPath = ref(db, `rooms/${roomId}/${userType}UserName`);
      set(roomIdPath, newUserName);
    },
    removeUser(roomId, userType) {
      if (window.confirm('本当に消去しますか？')) {
        const db = getDatabase();
        const userPath = ref(db, `rooms/${roomId}/${userType}`);
        const userNamePath = ref(db, `rooms/${roomId}/${userType}UserName`);
        const turnPath = ref(db, `rooms/${roomId}/turn`);
        set(userPath, '');
        set(userNamePath, '');
        set(turnPath, 'none');
      }
    },
    changeTurn(roomId, userId) {
      const db = getDatabase();
      const turnPath = ref(db, `rooms/${roomId}/turn`);
      set(turnPath, userId);
    },
    checkPassword() {
      const inputPassword = this.$refs.password.value;
      const db = getDatabase();
      const adminPath = ref(db, 'admin/');
      get(adminPath).then((snapshot) => {
        const data = snapshot.val();

        if (data) {
          const password = data.password;
          const salt = 'Negbc';

          const crypto = require('crypto');
          const shasum = crypto.createHash('sha256');
          shasum.update(inputPassword + salt); // ここの引数にハッシュを計算したい文字列を渡す
          const hash = shasum.digest('hex');

          if (hash === password) {
            this.isLogined = true;
          } else {
            alert('パスワードが違います');
          }
        } else {
          const salt = 'Negbc';

          const crypto = require('crypto');
          const shasum = crypto.createHash('sha256');
          shasum.update(inputPassword + salt); // ここの引数にハッシュを計算したい文字列を渡す
          const hash = shasum.digest('hex');
          set(adminPath, { password: hash });
          alert('パスワードを設定しました');
          this.isLogined = true;
        }
      });
    },

    changePassword() {
      const curpass = this.$refs.curpass.value;
      const newpass = this.$refs.newpass.value;
      const verifypass = this.$refs.verifypass.value;

      if (newpass !== verifypass) {
        this.$refs.passStat.innerHTML = '再入力のパスワードと一致しません';
        this.$refs.passStat.style = 'color: red';
        return;
      }

      const db = getDatabase();
      const adminPath = ref(db, 'admin/');
      get(adminPath).then((snapshot) => {
        const data = snapshot.val();

        const password = data.password;
        const salt = 'Negbc';

        const crypto = require('crypto');
        const shasum = crypto.createHash('sha256');
        shasum.update(curpass + salt); // ここの引数にハッシュを計算したい文字列を渡す
        const hash = shasum.digest('hex');

        if (password !== hash) {
          this.$refs.passStat.innerHTML = 'パスワードが違います';
          this.$refs.passStat.style = 'color: red';
        }
      });

      const salt = 'Negbc';

      const crypto = require('crypto');
      const shasum = crypto.createHash('sha256');
      shasum.update(newpass + salt); // ここの引数にハッシュを計算したい文字列を渡す
      const hash = shasum.digest('hex');

      set(adminPath, { password: hash });
      this.$refs.passStat.innerHTML = 'パスワードを変更しました';
      this.$refs.passStat.style = 'color: green';
    },
  },
};
</script>

<style lang="scss" scoped>
h1,
h2,
h3,
h4,
p {
  color: white;
}

.list-item {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include mq() {
    flex-direction: row;
  }
}

.room-id-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.board-list {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.menu {
  &:hover {
    cursor: pointer;
  }
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status {
  margin: 48px 0;
  font-size: 30px;

  @include mq() {
    font-size: 48px;
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
  height: 100%;

  &.expand {
    height: 100vh;
  }
}

.background {
  background-image: url(./static/background.jpg);
  background-position: 50%;
}

.title {
  font-size: 48px;
  text-align: center;
  color: white;

  @include mq() {
    font-size: 64px;
    margin-bottom: 48px;
  }
}

.title {
  font-size: 3rem;
}

.board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 300px;
  grid-column: 1;
  grid-row: -1 / 1;
}

.login {
  display: flex;
  flex-direction: column;
  justify-items: center;
  gap: 24px;
}

.login-button-box {
  display: flex;
  flex-direction: column;
  gap: 24px;

  @include mq() {
    margin-top: 32px;
    flex-direction: row;
  }
}

.password-input {
  padding: 6px 0;
}
</style>
