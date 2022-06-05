import { BOARD_RANGE, DIRECTIONS, DIRECTION_KEYS } from '~/assets/constants';

export function createUserId() {
  return String(Math.random()).slice(2, 8);
}

export function createRoomId() {
  return String(Math.random()).slice(2, 6);
}

export function applyHandicap(handicap) {
  const board = initBoard();

  if (handicap > 1) {
    board[0][0] = 'black';
  }
  if (handicap > 2) {
    board[7][7] = 'black';
  }
  if (handicap > 3) {
    board[0][7] = 'black';
  }
  if (handicap > 4) {
    board[7][0] = 'black';
  }

  return board;
}

export function rivalDisk(myDisk) {
  return myDisk === 'black' ? 'white' : 'black';
}

export function generateBoard() {
  const board = [];
  const row = ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'];

  for (let i = 0; i < row.length; i++) {
    board[i] = [...row];
  }

  return board;
}

export function initBoard() {
  const board = generateBoard();
  board[3][3] = 'white';
  board[4][4] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  return board;
}

export function initData() {
  return {
    roomId: '',
    myId: '',
    roomInfo: {
      host: '',
      guest: '',
      hostUserName: '',
      guestUserName: '',
      hostHandicap: 0,
      guestHandicap: 0,
      handicap: 0,
      turn: 'none',
      board: initBoard(),
      status: '',
      pass: '',
    },
  };
}

export function getPositionsAlongLine(putPos, key) {
  const positions = [];
  const direction = DIRECTIONS[key];

  let position = { x: putPos.x + direction.x, y: putPos.y + direction.y };

  while (checkRange(position)) {
    positions.push(position);
    position = { x: position.x + direction.x, y: position.y + direction.y };
  }

  return positions;
}

export function countDisks(board) {
  return {
    whiteCount: board.flatMap((x) => x.filter((disk) => disk === 'white'))
      .length,
    blackCount: board.flatMap((x) => x.filter((disk) => disk === 'black'))
      .length,
  };
}

export function checkPutPosition(board, pos, myDisk) {
  const flipPositions = getFlipPositions(board, pos, myDisk);
  return board[pos.y][pos.x] === 'none' && flipPositions.length > 0;
}

export function pass(board, myDisk) {
  for (const y of BOARD_RANGE) {
    for (const x of BOARD_RANGE) {
      if (board[y][x] !== 'none') continue;

      const flipPositions = getFlipPositions(board, { x, y }, myDisk);
      if (flipPositions.length > 0) {
        return false;
      }
    }
  }
  return true;
}

export function getFlipPositions(board, putPosition, myDisk) {
  const flipPositions = [];
  const rival = rivalDisk(myDisk);

  const allLines = DIRECTION_KEYS.map((key) =>
    getPositionsAlongLine(putPosition, key)
  );

  for (const line of allLines) {
    const rivalPositions = [];

    for (let i = 0; i < line.length; i++) {
      const position = line[i];
      const nextDisk = board[position.y][position.x];

      if (
        nextDisk === 'none' ||
        (i === 0 && nextDisk === myDisk) ||
        (i === line.length - 1 && nextDisk === rival)
      ) {
        break;
      } else if (nextDisk === rival) {
        rivalPositions.push(position);
      } else if (nextDisk === myDisk) {
        flipPositions.push(rivalPositions);
        break;
      }
    }
  }

  return flipPositions.flatMap((x) => x);
}

function checkRange(position) {
  return BOARD_RANGE.includes(position.x) && BOARD_RANGE.includes(position.y);
}

export function cloneBoard(board) {
  const newBoard = [];

  for (let i = 0; i < board.length; i++) {
    newBoard[i] = board[i].slice();
  }

  return newBoard;
}

export function flip(board, flipPositions, myDisk) {
  const newBoard = cloneBoard(board);
  for (let i = 0; i < flipPositions.length; i++) {
    newBoard[flipPositions[i].y][flipPositions[i].x] = myDisk;
  }

  return newBoard;
}
