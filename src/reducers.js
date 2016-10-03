import spinSlice from './util/spinSlice';
import { SPIN_SLICE, ROTATE_CUBE, COMMIT_ROTATE, COMMIT_SPIN, RANDOMIZE,
         END_RANDOMIZE } from './actions';
import { combineReducers, compose } from 'redux';

const PUZZLE_SIZE = 3;

const buildSolidSide = (num) => {
  const row = [];
  const side = [];
  for (let i = 0; i < PUZZLE_SIZE; i++) {
    row.push(num);
  }
  for (let i = 0; i < PUZZLE_SIZE; i++) {
    side.push([...row]);
  }
  return side;
}

const initialSideColors = {
  front: buildSolidSide(0),
  left: buildSolidSide(1),
  top: buildSolidSide(2),
  right: buildSolidSide(3),
  back: buildSolidSide(4),
  bottom: buildSolidSide(5)
};

// Base Reducers
const sideColors = (state = initialSideColors) => state;

const reduceRotation = (state, {axis, direction}) =>
  direction ? state[axis] + 90 : state[axis] - 90;

const initialRotation = {x: 0, y: 0, z: 0};
const rotation = (state = initialRotation, action = {}) => {
  switch (action.type) {
    case ROTATE_CUBE:
      return {...state, [action.axis]: reduceRotation(state, action)};
    default:
      return state;
  }
};

const rotationQueue = (state = [], action = {}) => {
  switch (action.type) {
    case ROTATE_CUBE:
      return state.concat(action);
    default:
      return state;
  }
};

const spinQueue = (state = null, action = {}) => {
  switch (action.type) {
    case SPIN_SLICE:
      return action;
    case COMMIT_SPIN:
      return {};
    default:
      return state;
  }
};

const isRandomizing = (state = false, action = {}) => {
  switch (action.type) {
    case RANDOMIZE:
      return true;
    case END_RANDOMIZE:
      return false;
    default:
      return state;
  }
}


const reduceCommitRotate = ({rotationQueue, sideColors}) => {

  const spinSlices = (colorState, slices, forward) => {
    let state = colorState;
    slices.forEach(s => state = spinSlice(state, s, forward));
    return state;
  };

  let newSideColors = sideColors;
  rotationQueue.forEach(({axis, direction}) => {
    const forward = axis === 'x' ? !direction : direction;
    const slices =
        axis === 'z' ? [0,1,2]
      : axis === 'x' ? [3,4,5]
      : axis === 'y' ? [6,7,8]
      : [];
    newSideColors = spinSlices(newSideColors, slices, forward);
  })

  return {
    rotation: initialRotation,
    sideColors: newSideColors,
    rotationQueue: []
  };
};

const reduceCommitSpin = ({sideColors, spinQueue}) => {
  return {
    sideColors: spinSlice(sideColors, spinQueue.slice, spinQueue.direction),
    spinQueue: null
  };
}

const reduceDefault = combineReducers({
  sideColors, rotation, rotationQueue, spinQueue, isRandomizing
});

export default (state = {}, action = {}) => {
  switch (action.type) {
    case COMMIT_ROTATE:
      return {...state, ...reduceCommitRotate(state)};
    case COMMIT_SPIN:
      return {...state, ...reduceCommitSpin(state)}
    default:
      return reduceDefault(state, action);
  }
}
