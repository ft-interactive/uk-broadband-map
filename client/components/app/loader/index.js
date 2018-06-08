/**
 * @file
 * Simple loader for when map is initialising
 */

import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const Loader = ({ mapLoaded, handleLoaderComplete }) => (
  <div className={`loader ${mapLoaded ? 'map-loaded' : ''}`} onTransitionEnd={handleLoaderComplete}>
    <h3>Loading map…</h3>
    <div className="o-loading o-loading--light o-loading--small" />
  </div>
);

Loader.propTypes = {
  mapLoaded: PropTypes.bool.isRequired,
  handleLoaderComplete: PropTypes.func.isRequired,
};

export default Loader;
