import React from 'react';
export default (spinSlice) => ({slice, forward, style}) => (
  <svg className='Arrow' width='36px' height='36px' viewBox='0 0 64 64'
      onClick={() => spinSlice(slice, forward)} style={style}>
    <circle fill='#4B61A1' cx='31.628' cy='31.627' r='29.628'/>
    <polyline fill='#8088BA' points='40.344,27.261 8.258,27.261 8.258,36.367
                                    40.344,36.367 31.329,47.751 56.298,31.815
                                    31.329,15.215'
    />
  </svg>
);
