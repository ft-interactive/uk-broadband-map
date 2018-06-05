/**
 * @file
 * Summary component
 */

import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const Summary = (props) => {
  if (Object.keys(props.geography).length === 0) return null;
  const yourSpeed = props.geography['Average_download_speed_(Mbit/s)'];
  const regionID = (name) => {
    switch (name) {
      case 'London': return { code: 'london', phrasing: 'London' };
      case 'Scotland': return { code: 'scotland', phrasing: 'Scotland' };
      case 'Wales': return { code: 'wales', phrasing: 'Wales' };
      case 'South East': return { code: 'se', phrasing: 'the South East' };
      case 'South West': return { code: 'sw', phrasing: 'the South West' };
      case 'East of England': return { code: 'ee', phrasing: 'the East of England' };
      case 'East Midlands': return { code: 'em', phrasing: 'the East Midlands' };
      case 'West Midlands': return { code: 'wm', phrasing: 'the West Midlands' };
      case 'Yorkshire and The Humber': return { code: 'YH', phrasing: 'Yorkshire and the Humber' };
      case 'North West': return { code: 'nw', phrasing: 'the North West' };
      case 'North East': return { code: 'ne', phrasing: 'the North East' };
      default: throw new Error('Unknown area!');
    }
  };
  const region = regionID(props.geography.region);
  const regionPc = props.speeds
    .filter(speed => speed.megabit < yourSpeed)
    .reduce((a, speed) => a + speed[`${region.code}-rural`] + speed[`${region.code}-urban`], 0);
  const regionPcRound = Math.round(regionPc);
  const regionPcText = regionPcRound === 100 ? 'almost 100' : regionPcRound;
  const text = `My broadband is faster than ${regionPcText}% of other people in ${region.phrasing}.`;
  const tweet = () => {
    const contents = `${text} https://ft.com/`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURI(contents)}`);
  };
  return (
    <div className="summary">
      <span>“{text}”</span>
      <button onClick={tweet}>Tweet this</button>
    </div>
  );
};

Summary.propTypes = {
  geography: PropTypes.any, // eslint-disable-line
  speeds: PropTypes.array.isRequired,
};

export default Summary;
