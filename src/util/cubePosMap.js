export default {
  A: {type: 'corner', dir: {x: 'left', y: 'top'}, depth: 0},
  B: {type: 'edge', dir: 'top', depth: 0},
  C: {type: 'corner', dir: {x: 'right', y: 'top'}, depth: 0},
  D: {type: 'edge', dir: 'left', depth: 0},
  E: {type: 'center', depth: 0},
  F: {type: 'edge', dir: 'right', depth: 0},
  G: {type: 'corner', dir: {x: 'left', y: 'bottom'}, depth: 0},
  H: {type: 'edge', dir: 'bottom', depth: 0},
  I: {type: 'corner', dir: {x: 'right', y: 'bottom'}, depth: 0},

  J: {type: 'corner', dir: {x: 'left', y: 'top'}, depth: 1},
  K: {type: 'edge', dir: 'top', depth: 1},
  L: {type: 'corner', dir: {x: 'right', y: 'top'}, depth: 1},
  M: {type: 'edge', dir: 'left', depth: 1},
  N: {type: 'edge', dir: 'right', depth: 1},
  O: {type: 'corner', dir: {x: 'left', y: 'bottom'}, depth: 1},
  P: {type: 'edge', dir: 'bottom', depth: 1},
  Q: {type: 'corner', dir: {x: 'right', y: 'bottom'}, depth: 1},

  R: {type: 'corner', dir: {x: 'left', y: 'top'}, depth: 2},
  S: {type: 'edge', dir: 'top', depth: 2},
  T: {type: 'corner', dir: {x: 'right', y: 'top'}, depth: 2},
  U: {type: 'edge', dir: 'left', depth: 2},
  V: {type: 'center', depth: 2},
  W: {type: 'edge', dir: 'right', depth: 2},
  X: {type: 'corner', dir: {x: 'left', y: 'bottom'}, depth: 2},
  Y: {type: 'edge', dir: 'bottom', depth: 2},
  Z: {type: 'corner', dir: {x: 'right', y: 'bottom'}, depth: 2},
};

export const sliceMembers = {
  0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
  1: ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
  2: [ 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],

  3: ['A', 'D', 'G', 'J', 'M', 'O', 'R', 'U', 'X'],
  4: ['B', 'E', 'H', 'K', 'P', 'S', 'V', 'Y'],
  5: ['C', 'F', 'I', 'L', 'N', 'Q', 'T', 'W', 'Z'],

  6: ['A', 'B', 'C', 'J', 'K', 'L', 'R', 'S', 'T'],
  7: ['D', 'E', 'F', 'M', 'N', 'U', 'V', 'W'],
  8: ['G', 'H', 'I', 'O', 'P', 'Q', 'X', 'Y', 'Z']
};
