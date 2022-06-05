import {
  getPositionsAlongLine,
  getFlipPositions,
  pass,
  initBoard,
  checkPutPosition,
  flip,
  generateBoard,
} from '~/scripts/reversi';

describe('getPositionsAlongLine', () => {
  function test(line, expected) {
    for (let i = 0; i < line.length; i++) {
      expect(line[i]).toEqual(expected[i]);
    }
  }

  it('左側のマスを全取得', () => {
    const line = getPositionsAlongLine({ x: 3, y: 3 }, 'left');
    const expected = [
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
    ];
    test(line, expected);
  });

  it('左上のマスを全取得', () => {
    const line = getPositionsAlongLine({ x: 3, y: 3 }, 'upLeft');
    const expected = [
      { x: 2, y: 2 },
      { x: 1, y: 1 },
      { x: 0, y: 0 },
    ];
    test(line, expected);
  });

  it('上のマスを全取得', () => {
    const line = getPositionsAlongLine({ x: 3, y: 3 }, 'up');
    const expected = [
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 3, y: 0 },
    ];
    test(line, expected);
  });

  it('右上のマスを全取得', () => {
    const line = getPositionsAlongLine({ x: 3, y: 3 }, 'upRight');
    const expected = [
      { x: 4, y: 2 },
      { x: 5, y: 1 },
      { x: 6, y: 0 },
    ];
    test(line, expected);
  });

  it('右のマスを全取得', () => {
    const line = getPositionsAlongLine({ x: 3, y: 3 }, 'right');
    const expected = [
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
    ];
    test(line, expected);
  });

  it('右下のマスを全取得', () => {
    const line = getPositionsAlongLine({ x: 3, y: 3 }, 'downRight');
    const expected = [
      { x: 4, y: 4 },
      { x: 5, y: 5 },
      { x: 6, y: 6 },
      { x: 7, y: 7 },
    ];
    test(line, expected);
  });

  it('下のマスを全取得', () => {
    const line = getPositionsAlongLine({ x: 3, y: 3 }, 'down');
    const expected = [
      { x: 3, y: 4 },
      { x: 3, y: 5 },
      { x: 3, y: 6 },
      { x: 3, y: 7 },
    ];
    test(line, expected);
  });

  it('左下のマスを全取得', () => {
    const line = getPositionsAlongLine({ x: 3, y: 3 }, 'downLeft');
    const expected = [
      { x: 2, y: 4 },
      { x: 1, y: 5 },
      { x: 0, y: 6 },
    ];
    test(line, expected);
  });
});

describe('checkPutPosition', () => {
  it('置けるケース', () => {
    const board = initBoard();
    expect(checkPutPosition(board, { x: 3, y: 2 }, 'black')).toBeTruthy();
  });

  it('置けないケース', () => {
    const board = initBoard();
    expect(checkPutPosition(board, { x: 7, y: 7 }, 'black')).toBeFalsy();
  });
});

describe('pass', () => {
  const board = generateBoard();

  for (let i = 0; i < 3; i++) {
    board[i] = [
      'white',
      'white',
      'white',
      'white',
      'white',
      'white',
      'white',
      'white',
    ];
  }

  board[3] = [
    'black',
    'black',
    'black',
    'black',
    'black',
    'black',
    'black',
    'black',
  ];

  it('パスの場合', () => {
    expect(pass(board, 'black')).toBeTruthy();
  });

  it('パスではない場合', () => {
    expect(pass(board, 'white')).toBeFalsy();
  });
});

describe('getFlipPositions', () => {
  const board = initBoard();
  it('白のコマを1つひっくり返せる', () => {
    const list = getFlipPositions(board, { x: 3, y: 2 }, 'black');

    expect(list).toHaveLength(1);
    expect(list[0]).toEqual({ x: 3, y: 3 });
  });
});

describe('flip', () => {
  it('マスが白から黒に変わる', () => {
    const board = initBoard();
    const putPosition = { x: 3, y: 2 };
    const list = getFlipPositions(board, putPosition, 'black');
    list.push(putPosition);

    expect(board[3][3]).toEqual('white');
    const newBoard = flip(board, list, 'black');
    expect(newBoard[3][3]).toEqual('black');
  });
});
