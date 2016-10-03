import React from 'react';
import getCubeColors from './getCubeColors';
import Cube from '../Cube';
import Controls from '../Controls';

import cubePosMap from '../util/cubePosMap';
import renderSlicedCubes from './renderSlicedCubes';

export default ({sideColors, rotation, spinQueue, isRandomizing, actions}) => {
  const cubes =
    Object.entries(cubePosMap)
    .map(([key, props]) =>
      <Cube key={key} {...props} colors={
        getCubeColors(props, sideColors)
      }/>
    );

  const animateCubeRotation =
    Object.values(rotation).some(deg => Math.abs(deg) > 0);

  return (
    <div style={{position: 'relative'}}>
      <div className='Puzzle-wrapper'>
        <div className='Puzzle'
             onTransitionEnd={actions.commitRotate}
             style={{
                transitionDuration: animateCubeRotation ? '0.2s' : '0s',
                transform: 'translate(320px, 200px)' +
                           `rotateX(${rotation.x}deg)` +
                           `rotateY(${rotation.y}deg)` +
                           `rotateZ(${rotation.z}deg)`
              }
        }>
          {spinQueue ? renderSlicedCubes(cubes, spinQueue, {actions}) : cubes}
        </div>
      </div>
      <Controls actions={actions} disabled={isRandomizing}/>
    </div>

  );
};
