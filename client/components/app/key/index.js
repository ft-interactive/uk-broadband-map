/**
 * @file
 * Key element
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { scaleThreshold } from 'd3';
import { getWidth } from '../../../helpers';

import './styles.scss';

const Key = (props) => {
  const { layout, viewportWidth } = props;
  const lineHeight = 14; // This is equal to font-size.
  const isMobile = ['default', 's', 'm'].includes(layout.toLowerCase());
  const legendHeight = 20;
  const height = isMobile ? 50 + legendHeight : 35 + legendHeight;
  const padding = 5;
  const labelHeight = isMobile ? 40 : 25;
  const width = layout === 'default' ? viewportWidth : getWidth(layout);
  const colorRamp = [
    '#981626',
    '#c41439',
    '#ef1757',
    '#ff5a5f',
    '#ff8d67',
    '#ffb67f',
    '#ffdca2',
    '#ffffcc',
  ];
  const ticks = ['10', '20', '30', '40', '50', '60', '70'];
  const colorScale = scaleThreshold()
    .range(colorRamp)
    .domain(ticks);
  const binWidth = width / colorScale.range().length;
  const barHeight = height - labelHeight - legendHeight;

  return (
    <Fragment>
      <h2 className="key__header graphic__title">
        Britain&rsquo;s city centres are<br />in the internet slow lane
      </h2>
      <svg className="key__legend" height={height} width={width}>
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="0"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#a8a9ad" />
          </marker>
          <linearGradient id="color-ramp-gradient">
            {colorScale.range().map((c, idx, arr) => {
              if (idx === 0) {
                return (
                  <Fragment key={c}>
                    <stop
                      offset={`${(idx / arr.length) * 100}%` /* prettier-ignore */}
                      style={{ stopColor: c }}
                    />
                    <stop
                      offset={`${((idx + 1) / arr.length) * 100}%` /* prettier-ignore */}
                      style={{ stopColor: c }}
                    />
                  </Fragment>
                );
              }

              return (
                <stop
                  key={c}
                  offset={`${(idx / arr.length) * 100}%` /* prettier-ignore */}
                  style={{ stopColor: c }}
                />
              );
            })}
          </linearGradient>
        </defs>
        <g className="legend" transform="translate(0, -4)">
          <text y="14" x={0} fill="#a8a9ad" textAnchor="start">
            Slow
          </text>
          <line
            x1={8 * padding}
            y1={legendHeight / 2}
            x2={width - (8 * padding) /* prettier-ignore */}
            y2={legendHeight / 2}
            stroke="#a8a9ad"
            strokeWidth="1"
            markerEnd="url(#arrow)"
          />
          <text y="14" x={width} fill="#a8a9ad" textAnchor="end">
            Fast
          </text>
        </g>
        <g transform={`translate(0, ${legendHeight})`}>
          <rect
            className="bins"
            fill="url(#color-ramp-gradient)"
            x={0}
            y={0}
            width={width}
            height={barHeight}
          />
          <g className="ticks">
            {colorScale.domain().map((d, idx) => (
              <g className="tick" key={d}>
                <line
                  stroke="white"
                  x1={(idx + 1) * binWidth}
                  x2={(idx + 1) * binWidth}
                  y1={0}
                  y2={barHeight + padding /* prettier-ignore */}
                />
                {d.split('\n').map((line, i) => (
                  <text
                    className="label-text"
                    x={(idx + 1) * binWidth /* prettier-ignore */}
                    y={
                      /* prettier-ignore */
                      barHeight + padding + lineHeight + (i * lineHeight)
                    }
                    key={line.replace('\n', '-')}
                  >
                    {line}
                  </text>
                ))}
              </g>
            ))}
          </g>
        </g>
      </svg>
      <h5 className="key__footer">MBits/s</h5>
    </Fragment>
  );
};

Key.propTypes = {
  layout: PropTypes.string.isRequired,
  viewportWidth: PropTypes.number.isRequired,
};

export default connect(({ oGridLayout, viewport }) => ({
  layout: oGridLayout,
  viewportWidth: viewport.width,
}))(Key);
