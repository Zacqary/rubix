export const SPIN_SLICE = Symbol('SPIN_SLICE');
export const ROTATE_CUBE = Symbol('ROTATE_CUBE');

export const COMMIT_ROTATE = Symbol('COMMIT_ROTATE');
export const COMMIT_SPIN = Symbol('COMMIT_SPIN');

export const RANDOMIZE = Symbol('RANDOMIZE');
export const END_RANDOMIZE = Symbol('RANDOMIZE');

export default {
  spinSlice: (slice, direction) => ({type: SPIN_SLICE, slice, direction}),
  rotateCube: (axis, direction) => ({type: ROTATE_CUBE, axis, direction}),
  commitRotate: () => ({type: COMMIT_ROTATE}),
  commitSpin: () => ({type: COMMIT_SPIN}),
  randomize: () => ({type: RANDOMIZE}),
  endRandomize: () => ({type: END_RANDOMIZE})
};
