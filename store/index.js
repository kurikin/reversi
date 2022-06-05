import { getDatabase, ref, onValue, off } from "@firebase/database";
import { initData } from "~/scripts/reversi";
import firebaseApp from "~/scripts/repository";

const db = getDatabase(firebaseApp);
const roomPath = (roomId) => ref(db, `rooms/${roomId}`);

export const state = () => ({
  data: initData(),
  isAudience: false,
});

export const mutations = {
  setData(state, data) {
    state.data = data;
  },
  setAudience(state) {
    state.isAudience = true;
  },
};

export const getters = {
  board(state) {
    return state.data.roomInfo.board;
  },
  myTurn(state) {
    return state.data.myId === state.data.roomInfo.turn;
  },
  isHost(state) {
    return state.data.myId === state.data.roomInfo.host;
  },
  myDisk(state) {
    return state.data.myId === state.data.roomInfo.host ? "black" : "white";
  },
  rivalId(state) {
    return state.data.myId === state.data.roomInfo.host
      ? state.data.roomInfo.guest
      : state.data.roomInfo.host;
  },
  isAudience(state) {
    return state.isAudience;
  },
};

export const actions = {
  subscribe(context) {
    const ref = roomPath(context.state.data.roomId);

    onValue(ref, (snapshot) => {
      const roomInfo = snapshot.val();

      const data = {
        roomId: context.state.data.roomId,
        myId: context.state.data.myId,
        roomInfo,
      };

      context.commit("setData", data);
    });
  },
  unsbscribe(context) {
    const ref = roomPath(context.state.data.roomId);
    off(ref);
  },
};
