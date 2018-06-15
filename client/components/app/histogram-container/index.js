/**
 * @file
 * Container for Histograms w/ summary
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Histogram from '../histogram';
import Summary from '../summary';
import { propTypeSpeed, propTypeActiveGeography } from '../../../helpers/proptypes';

const HistogramContainer = ({ speeds, activeGeography }) => (
  <div className="histogram-container">
    <Histogram geography={activeGeography} speeds={speeds} />
    <Summary geography={activeGeography} speeds={speeds} />
  </div>
);

HistogramContainer.propTypes = {
  speeds: PropTypes.arrayOf(propTypeSpeed),
  activeGeography: propTypeActiveGeography,
};

HistogramContainer.defaultProps = {
  speeds: [],
  activeGeography: {},
};

export default connect(({ speeds, activeGeography }) => ({
  speeds,
  activeGeography,
}))(HistogramContainer);
