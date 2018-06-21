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
  const { layout, title } = props;
  const lineHeight = 14; // This is equal to font-size.
  const isMobile = ['default', 's', 'm'].includes(layout.toLowerCase());
  const height = isMobile ? 50 : 50;
  const padding = 5;
  const labelHeight = isMobile ? 40 : 25;
  const width = getWidth(layout) - (2 * padding); // prettier-ignore
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
  const mobileColorRamp = colorRamp.filter((d, i) => i < 4 || i === 7);
  const mobileTicks = ['0', '10', '24\nGovernment', '30\nOfcom', '>80\nSuperfast'];
  const colorScale = scaleThreshold()
    .range(isMobile ? mobileColorRamp : colorRamp)
    .domain(isMobile ? mobileTicks : ticks);
  const binWidth = width / colorScale.range().length;

  return (
    <Fragment>
      <h4 style={{ textAlign: 'center' }}>{title}</h4>
      <svg className="legend" height={height} width={width}>
        <g transform={`translate(${padding}, 0)`}>
          <g className="bins">
            {colorScale
              .range()
              .map((c, idx) => (
                <rect
                  key={c}
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
              <g className="tick" key={d}>
                {(isMobile ? idx + 1 < colorScale.domain().length : true) && (
                  <line
                    stroke="white"
                    x1={(idx + 1) * binWidth}
                    x2={(idx + 1) * binWidth}
                    y1={0}
                    y2={(height - labelHeight) + padding /* prettier-ignore */}
                  />
                )}
                {d.split('\n').map((line, i) => (
                  <text
                    className="label-text"
                    x={isMobile ? idx * binWidth : (idx + 1) * binWidth /* prettier-ignore */}
                    y={
                      /* prettier-ignore */
                      (height - labelHeight) + padding + lineHeight + (i * lineHeight)
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
    </Fragment>
  );
};

Key.propTypes = {
  title: PropTypes.string,
  layout: PropTypes.string.isRequired,
};

Key.defaultProps = {
  title: 'Legend',
};

export default connect(({ oGridLayout }) => ({ layout: oGridLayout }))(Key);
