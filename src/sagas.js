import { take, put, fork, race, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import actionCreators, { COMMIT_SPIN, RANDOMIZE } from './actions';

const randomNumber = 35;

function* randomlySpin() {
  // Randomly select an axis and a direction, and rotate the cube that way
  const axes = ['x', 'y', 'z'];
  const axis = axes[Math.floor(Math.random() * 3)];
  const direction = Boolean(Math.round(Math.random()));
  yield put(actionCreators.rotateCube(axis, direction));
}

function* randomizeCube() {
  // Perform a random spinSlice 35 times to shuffle the cube
  let lastSlice = null;
  for (let i = 0; i < randomNumber; i++) {
    // Every 4 spinSlices, randomly rotate the cube too
    if (i % 4 === 0) yield fork(randomlySpin);

    let slice = lastSlice;
    while(slice === lastSlice) {
      slice = Math.floor(Math.random() * 9);
    }
    const direction = Boolean(Math.round(Math.random()));
    yield put(actionCreators.spinSlice(slice, direction));
    // Perform the next spin as soon as the last spin is committed
    // Or after 200ms, because sometimes Saga is too slow to catch the
    // transitionend event
    yield race({
      nextSpin: take(COMMIT_SPIN),
      timeout: call(delay, 200)
    });
  }
  yield put(actionCreators.endRandomize());
}

function* watchRandomize() {
  while (yield take(RANDOMIZE)) {
    yield fork(randomizeCube);
  }
}

export default function*() {
  yield [
    fork(watchRandomize)
  ];
}
