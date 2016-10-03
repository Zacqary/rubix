import React from 'react';
import { sliceMembers } from '../util/cubePosMap';

const adjacentInnerSlices = {
  0: 1,
  1: 2,
  2: null,
  3: 4,
  4: 5,
  5: null,
  6: 7,
  7: 8,
  8: null
};

const SpinningSlice = ({children, actions, axis, animDirection}) => {
  return (
    <div className='SpinningSlice'>
        <section style={{
          height: '300px',
          width: '300px',
          transformOrigin: '33% 33% -2px',
          animation: `SpinningSlice-${animDirection}-${axis} 0.125s`
        }} onAnimationEnd={actions.commitSpin}>
          {children}
        </section>
      </div>
  );
};

export default (cubes, {slice = null, direction}, spinnerProps) => {
  if (slice === null) return cubes;

  // Get a list of letter-codes for the cubes in this slice
  const sliceKeys = sliceMembers[slice];
  // Pluck these cubes from the array of all cubes
  const slicedCubes = cubes.filter(({key}) => sliceKeys.includes(key));
  // And also create an array of cubes that aren't in the slice
  // Nest it inside another array to spread it later; this is useful in case
  // an InnerSlice needs to be added
  const unslicedCubes = [
    cubes.filter(({key}) => !sliceKeys.includes(key))
  ];

  // If this slice is next to an InnerSlice, also slice this InnerSlice
  // This is so the black inner faces of these cubes will be displayed during
  // the animation
  if (adjacentInnerSlices[slice]) {

    const innerSlice = sliceMembers[adjacentInnerSlices[slice]];
    const allUnsliced = unslicedCubes.pop();

    const visibleInnerSlice =
      allUnsliced.filter(({key}) => innerSlice.includes(key));
    const restOfUnsliced =
      allUnsliced.filter(({key}) => !innerSlice.includes(key));

    // Rebuild unslicedCubes with the InnerSlice
    unslicedCubes.push(
      <span className='InnerSlice' key='InnerSlice'>
        {visibleInnerSlice}
      </span>,
      restOfUnsliced
    );

  }

  // Render the SpinningSlice
  const axis =
      slice < 3 ? 'z'
    : slice < 6 ? 'x'
    : 'y';

  // Reverse animation direction for the X axis
  const spinDirection = axis === 'x' ? !direction : direction;
  const props = {
    axis,
    animDirection: spinDirection ? 'forward' : 'backward',
    ...spinnerProps};
  return [
    <SpinningSlice {...props} key='SpinningSlice'>
      {slicedCubes}
    </SpinningSlice>,
    ...unslicedCubes
  ];
};
