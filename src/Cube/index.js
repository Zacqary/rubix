import React from 'react';

const CUBE_SIZE_PX = 100;
const CUBE_COLORS = [
  '#39c', '#927fb9', '#edbe01', '#dedede', '#e55447', '#73bf4c'
];

export default ({type, dir, depth, colors}) => {
  const innerFaceKeys = ['front', 'left', 'right', 'top'];
  const children = [];

  if (depth === 0) {
    children.push(<div className='Cube-face front' key='front'/>);
  } else if (depth === 2) {
    children.push(<div className='Cube-face back' key='back'/>);
  }

  if (type === 'edge') {
    children.push(<div className={`Cube-face ${dir}`} key={dir}/>);
  } else if (type === 'corner') {
    children.push(<div className={`Cube-face ${dir.x}`} key={dir.x}/>);
    children.push(<div className={`Cube-face ${dir.y}`} key={dir.y}/>);
  }

  const usedKeys = children.map(c => c.key);
  const remainingKeys = innerFaceKeys.filter(k => !usedKeys.includes(k));
  children.push(...remainingKeys.map(
    k => <div className={`Cube-face inner-face ${k}`} key={k}/>
  ));

  const zPos = depth * CUBE_SIZE_PX - CUBE_SIZE_PX + 2;
  const xPos = (() => {
    switch (type) {
      case 'edge':
        switch (dir) {
          case 'top':
          case 'bottom':
            return 1;
          case 'left':
            return 0;
          case 'right':
            return 2;
          default:
            throw 'Invalid edge x position';
        }
      case 'corner':
        switch (dir.x) {
          case 'left':
            return 0;
          case 'right':
            return 2;
          default:
            throw 'Invalid corner x position';
        }
      default:
        return 1;
    }
  })() * CUBE_SIZE_PX - (CUBE_SIZE_PX / 2);
  const yPos = (() => {
    switch (type) {
      case 'edge':
        switch (dir) {
          case 'top':
            return 0;
          case 'bottom':
            return 2;
          case 'left':
          case 'right':
            return 1;
          default:
            throw 'Invalid edge y position';
        }
      case 'corner':
        switch (dir.y) {
          case 'top':
            return 0;
          case 'bottom':
            return 2;
          default:
            throw 'Invalid corner y position';
        }
      default:
        return 1;
    }
  })() * CUBE_SIZE_PX - (CUBE_SIZE_PX / 2);

  return (
    <div className='Cube' style={{
      position: 'absolute',
      top: 0,
      left: 0,
      transform: `translate3d(${xPos}px, ${yPos}px, ${-zPos}px)`
    }}>
      {children.map((face, i) =>
        React.cloneElement(face, {
          style: {backgroundColor: CUBE_COLORS[colors[i]]}
        })
      )}
    </div>
  );
};
