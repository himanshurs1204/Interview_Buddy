import React from 'react';

const SpinnerLoader = ({ size = '16px', color = '#0891B2' }) => {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2"
      style={{
        width: size,
        height: size,
        borderColor: `${color}`,
        borderTopColor: 'transparent',
      }}
    />
  );
};

export default SpinnerLoader;
