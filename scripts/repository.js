import { getDatabase, ref, set, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  databaseURL: process.env.DATABASE_URL,
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;

const db = getDatabase(firebaseApp);
const roomPath = function (roomId) {
  if (roomId === null) {
    return ref(db, 'rooms/');
  }

  return ref(db, `rooms/${roomId}`);
};

export async function getRoomInfo(roomId) {
  const ref = roomPath(roomId);
  const snapshot = await get(ref);
  if (snapshot.val()) {
    return snapshot.val();
  }

  return null;
}

export async function setRoomInfo(roomId, roomInfo) {
  const ref = roomPath(roomId);
  return await set(ref, roomInfo);
}
