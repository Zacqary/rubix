import spinSlice from './util/spinSlice';
import { SPIN_SLICE, ROTATE_CUBE, COMMIT_ROTATE, COMMIT_SPIN, RANDOMIZE,
         END_RANDOMIZE } from './actions';
import { combineReducers } from 'redux';


// Initial state of what colors are on each side of the cube
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
};
const initialSideColors = {
  front: buildSolidSide(0),
  left: buildSolidSide(1),
  top: buildSolidSide(2),
  right: buildSolidSide(3),
  back: buildSolidSide(4),
  bottom: buildSolidSide(5)
};

// Base Reducers

// sideColors - The positions of each color on the sides of the cube
const sideColors = (state = initialSideColors) => state;

// rotation - The rotation animation to apply to the cube
// (Rotating the cube plays the rotate animation, then applies the change to
// sideColors and resets the rotation state)
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

// rotationQueue - A queue of cube rotations
// This ensures the correct sequence of rotations gets applied if the user
// rotates the cube more than once before the transitionend event fires to
// commit the changes to sideColors
const rotationQueue = (state = [], action = {}) => {
  switch (action.type) {
    case ROTATE_CUBE:
      return state.concat(action);
    default:
      return state;
  }
};

// spinQueue - A queued up action to perform a spin animation
// This is similar to rotationQueue, but only supports one spin at a time
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

// isRandomizing - True when the cube is playing its randomization animation
const isRandomizing = (state = false, action = {}) => {
  switch (action.type) {
    case RANDOMIZE:
      return true;
    case END_RANDOMIZE:
      return false;
    default:
      return state;
  }
};

// By default, run simple reducers on each property
const reduceDefault = combineReducers({
  sideColors, rotation, rotationQueue, spinQueue, isRandomizing
});

// ==========
// More complex reducers to commit actions
// These reducers happen as the result of transitionend events, not user input

// Reduce a cube rotation into multiple spinSlice calls
const reduceCommitRotate = ({rotationQueue, sideColors}) => {

  // Helper function to spin all three slices on an axis at once
  const spinSlices = (colorState, slices, forward) => {
    let state = colorState;
    slices.forEach(s => state = spinSlice(state, s, forward));
    return state;
  };

  // Go through each rotation action in the rotationQueue, and apply it to
  // the sideColors through a spinSlices call
  let newSideColors = sideColors;
  rotationQueue.forEach(({axis, direction}) => {
    const forward = axis === 'x' ? !direction : direction;
    const slices =
        axis === 'z' ? [0,1,2]
      : axis === 'x' ? [3,4,5]
      : axis === 'y' ? [6,7,8]
      : [];
    newSideColors = spinSlices(newSideColors, slices, forward);
  });

  // Return the new side colors, and reset the rotation states
  return {
    rotation: initialRotation,
    sideColors: newSideColors,
    rotationQueue: []
  };
};

// Reduce a spin action to sideColors
const reduceCommitSpin = ({sideColors, spinQueue}) => {
  return {
    sideColors: spinSlice(sideColors, spinQueue.slice, spinQueue.direction),
    spinQueue: null
  };
};

// ==========
// Main Reducer
export default (state = {}, action = {}) => {
  switch (action.type) {
    case COMMIT_ROTATE:
      return {...state, ...reduceCommitRotate(state)};
    case COMMIT_SPIN:
      return {...state, ...reduceCommitSpin(state)};
    default:
      return reduceDefault(state, action);
  }
};
