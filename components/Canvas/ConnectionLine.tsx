import React from 'react';

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ x1, y1, x2, y2 }) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth="2"
    />
  );
};

export default ConnectionLine;