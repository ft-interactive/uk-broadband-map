/**
 * @file
 * Key element
 */

import React from 'react';
import PropTypes from 'prop-types';
import { scaleThreshold } from 'd3';
import './styles.scss';

const Key = (props) => {
  const colorScale = scaleThreshold()
    .range(['#981626', '#c41439', '#ef1757', '#ff5a5f', '#ff8d67', '#ffb67f', '#ffdca2', '#ffffcc'])
    .domain([10, 20, 30, 40, 50, 60, 70]);

  const binWidth = 50;
  const { height, labelHeight } = props;
  return (
    <svg className="legend" height={height} width={binWidth * colorScale.range().length}>
      <g className="bins">
        {colorScale
          .range()
          .map((c, idx) => (
            <rect
              fill={c}
              x={idx * binWidth}
              y={0}
              width={binWidth}
              height={height - labelHeight}
            />
          ))}
      </g>
      <g className="ticks">
        {colorScale.domain().map((d, idx) => (
          <g className="tick">
            {/* prettier-ignore */}
            <line
              stroke="white"
              x1={(idx + 1) * binWidth}
              x2={(idx + 1) * binWidth}
              y1={0}
              y2={height - (labelHeight / 2)}
            />
            <text
              style={{ textAnchor: 'middle', fontSize: '0.5em', fill: 'white' }}
              x={(idx + 1) * binWidth}
              y={height}
            >
              {d}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

Key.propTypes = {
  labelHeight: PropTypes.number,
  height: PropTypes.number,
};

Key.defaultProps = {
  labelHeight: 15,
  height: 100,
};

export default Key;
