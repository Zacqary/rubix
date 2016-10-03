const sliceMap = {
  0: [
    ['top', 2, null],
    ['right', null, 0],
    ['bottom', 0, null],
    ['left', null, 2]
  ],
  1: [
    ['top', 1, null],
    ['right', null, 1],
    ['bottom', 1, null],
    ['left', null, 1]
  ],
  2: [
    ['top', 0, null],
    ['right', null, 2],
    ['bottom', 2, null],
    ['left', null, 0]
  ],
  3: [
    ['top', null, 0],
    ['front', null, 0],
    ['bottom', null, 2],
    ['back', null, 2]
  ],
  4: [
    ['top', null, 1],
    ['front', null, 1],
    ['bottom', null, 1],
    ['back', null, 1]
  ],
  5: [
    ['top', null, 2],
    ['front', null, 2],
    ['bottom', null, 0],
    ['back', null, 0]
  ],
  6: [
    ['front', 0, null],
    ['right', 0, null],
    ['back', 2, null],
    ['left', 0, null]
  ],
  7: [
    ['front', 1, null],
    ['right', 1, null],
    ['back', 1, null],
    ['left', 1, null]
  ],
  8: [
    ['front', 2, null],
    ['right', 2, null],
    ['back', 0, null],
    ['left', 2, null]
  ]
};

const sliceEdges = {
  0: 'front',
  1: null,
  2: 'back',
  3: 'left',
  4: null,
  5: '!right',
  6: '!top',
  7: null,
  8: '!bottom'
};

export default (sideColors, sliceNumber, forward = true) => {
  const newSideColors = JSON.parse(JSON.stringify(sideColors));
  const sliceDef = sliceMap[sliceNumber];
  // Look up initial positions of the rotating rows/cols
  const transforms = sliceDef.map(operation => {
    const [sideName, row, column] = operation;
    if (row !== null) {
        return sideColors[sideName][row];
    } else if (column !== null) {
      return sideColors[sideName].map(r => r[column]);
    }
  });
  // Rotate them
  if (forward) {
    transforms.unshift(transforms.pop());
  } else {
    transforms.push(transforms.shift());
  }
  // Apply the transformations
  sliceDef.forEach((operation, i, arr) => {
    const [sideName, row, column] = operation;
    const isColumnTransform = row === null && column !== null;

    const prevTransform = arr[i - 1] || arr[arr.length - 1];
    const prevTransformType =
        !prevTransform ? null
      : prevTransform[1] !== null ? 'row'
      : 'column';

    const transform = transforms[i];
    if (!isColumnTransform) {
      const shouldReverse =
        forward && sideName === 'top' || !forward && sideName === 'bottom';
      const newRow =
          prevTransformType === 'column' && shouldReverse ? [...transform].reverse()
        : transform;

      newSideColors[sideName][row] = newRow;
    } else {
      const getIdx = (idx) =>
          prevTransformType === 'row' && sideName !== 'right' ? Math.abs(idx - 2)
        : idx;
      newSideColors[sideName].forEach(
        (r, idx) => r.splice(column, 1, transform[getIdx(idx)])
      );
    }
  });

  // Rotate the edge of the slice, if it has one
  if (sliceEdges[sliceNumber]) {
    const rotSideName = sliceEdges[sliceNumber].replace('!', '');
    const rotateReverse =
      sliceEdges[sliceNumber].includes('!') ? forward : !forward;

    const originalSide = sideColors[rotSideName];
    const [top, mid, btm] = originalSide;

    let newSide = [
      [btm[0], mid[0], top[0]],
      [btm[1], mid[1], top[1]],
      [btm[2], mid[2], top[2]]
    ];
    if (rotateReverse) {
      newSide = [
        [top[2], mid[2], btm[2]],
        [top[1], mid[1], btm[1]],
        [top[0], mid[0], btm[0]]
      ];
    }
    newSideColors[rotSideName] = newSide;
  }

  return newSideColors;
};
