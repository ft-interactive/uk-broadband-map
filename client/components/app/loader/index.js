/**
 * @file
 * Simple loader for when map is initialising
 */

import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const Loader = ({ mapLoaded, handleLoaderComplete }) => (
  <div className={`loader ${mapLoaded ? 'map-loaded' : ''}`} onTransitionEnd={handleLoaderComplete}>
    <p>Loading…</p>
  </div>
);

Loader.propTypes = {
  mapLoaded: PropTypes.bool.isRequired,
  handleLoaderComplete: PropTypes.bool.isRequired,
};

export default Loader;
