const getFace = (sideColors, sideName, row, col) => {
  if (sideName === 'bottom' || sideName === 'back') {
    return sideColors[sideName][Math.abs(2 - row)][Math.abs(2 - col)];
  } else {
    return sideColors[sideName][row][col];
  }
};

export default ({type, dir, depth}, sideColors) => {
  const getCornerSides = () => {
    let sides;
    switch (depth) {
      case 1:
        sides = [dir.x, dir.y];
        break;
      case 2:
        sides = ['back', dir.x, dir.y];
        break;
      default:
        sides = ['front', dir.x, dir.y];
        break;
    }

    let sidePositions;
    if (dir.x === 'left') {
      if (dir.y === 'top') {
        sidePositions = [[0, 0], [0, 2 - depth], [2 - depth, 0]];
      } else {
        sidePositions = [[2, 0], [2, 2 - depth], [2 - depth, 0]];
      }
    } else {
      if (dir.y === 'top') {
        sidePositions = [[0, 2], [0, depth], [2 - depth, 2]];
      } else {
        sidePositions = [[2, 2], [2, depth], [2 - depth, 2]];
      }
    }
    if (depth === 1) sidePositions.shift();
    return sides.map((sideName, idx) => {
      const [row, col] = sidePositions[idx];
      return getFace(sideColors, sideName, row, col);
    });
  };
  const getEdgeSides = () => {
    let sides;
    switch (depth) {
      case 1:
        sides = [dir];
        break;
      case 2:
        sides = ['back', dir];
        break;
      default:
        sides = ['front', dir];
        break;
    }

    const edgePositionMap = {
      left: [[1, 0], [1, 2 - depth]],
      right: [[1, 2], [1, depth]],
      top: [[0, 1], [2 - depth, 1]],
      bottom: [[2, 1], [2 - depth, 1]]
    };
    const sidePositions = edgePositionMap[dir];
    if (depth === 1) sidePositions.shift();

    return sides.map((sideName, idx) => {
      const [row, col] = sidePositions[idx];
      return getFace(sideColors, sideName, row, col);
    });
  };
  const getCenterSide = () => {
    if (depth === 0) return [getFace(sideColors, 'front', 1, 1)];
    else return [getFace(sideColors, 'back', 1, 1)];
  };

  switch (type) {
    case 'corner':
      return getCornerSides();
    case 'edge':
      return getEdgeSides();
    default:
      return getCenterSide();
  }

};
