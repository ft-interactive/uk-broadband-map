/**
 * @file
 * Summary component
 */

import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const Summary = (props) => {
  if (!props.geography
      || Object.keys(props.geography).length === 0
      || props.geography['Average_download_speed_(Mbit/s)'] === 'NA'
      || props.geography['Average_download_speed_(Mbit/s)'] === undefined) return null;
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
  const regionPcNumber = regionPcRound >= 50 ? regionPcRound : 100 - regionPcRound;
  const regionPcText = regionPcNumber === 100 ? 'almost 100' : regionPcNumber;
  const direction = regionPc >= 50 ? 'faster' : 'slower';
  const text = `My broadband is ${direction} than ${regionPcText}% of postcodes in ${region.phrasing}.`;
  const message = `${text} https://ig.ft.com/gb-broadband-speed-map`;
  const tweet = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURI(message)}`);
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
