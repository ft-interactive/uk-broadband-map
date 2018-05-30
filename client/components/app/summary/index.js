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
  const regionID = name => {
    switch (name) {
      case 'London': return { code: 'London', phrasing: 'London' };
      case 'Scotland': return { code: 'Scotland', phrasing: 'Scotland' };
      case 'Wales': return { code: 'Wales', phrasing: 'Wales' };
      case 'South East': return { code: 'SE', phrasing: 'the South East' };
      case 'South West': return { code: 'SW', phrasing: 'the South West' };
      case 'East of England': return { code: 'EE', phrasing: 'the East of England' };
      case 'East Midlands': return { code: 'EM', phrasing: 'the East Midlands' };
      case 'West Midlands': return { code: 'WM', phrasing: 'the West Midlands' };
      case 'Yorkshire and The Humber': return { code: 'YH', phrasing: 'Yorkshire and the Humber' };
      case 'North West': return { code: 'NW', phrasing: 'the North West' };
      case 'North East': return { code: 'NE', phrasing: 'the North East' };
      default: throw new Error('Unknown area!');
    }
  };
  const region = regionID(props.geography.region);
  const regionPercentage = props.speeds.filter(speed => speed.megabit < yourSpeed).reduce((a, speed) => {
    return a + speed[`${region.code}_rural`] + speed[`${region.code}_urban`];
  }, 0);
  const text = `My broadband is faster than ${Math.round(regionPercentage)}% of other people in ${region.phrasing}.`
  const tweet = () => {
    const contents = text + ' https://ft.com/';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURI(contents)}`);
  }
  return <div className="summary">
    <span>“{text}”</span>
    <button onClick={tweet}>Tweet this</button>
  </div>;
}

Summary.propTypes = {
  geography: PropTypes.any, // eslint-disable-line
  speeds: PropTypes.array.isRequired,
};

export default Summary;
