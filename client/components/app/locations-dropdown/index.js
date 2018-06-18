/**
 * @file
 * Interesting locales dropdown box
 */

import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const LocationsDropdown = ({ presets, selectedPreset, choosePreset }) => (
  <div className="locate-user-presets">
    <label htmlFor="locate-user-presets__select">Go to a predefined area of interest</label>
    <select
      className="locate-user-presets__select"
      name="locate-user-presets__select"
      value={selectedPreset}
      onChange={e => choosePreset(presets.find(d => d.id === e.target.value))}
    >
      <option value-="">Select preset view</option>
      {presets.map(location => (
        <option key={location.id} value={location.id}>
          {location.label}
        </option>
      ))}
    </select>
  </div>
);

LocationsDropdown.propTypes = {
  presets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      viewport: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        zoom: PropTypes.number.isRequired,
      }),
    }),
  ).isRequired,
  choosePreset: PropTypes.func.isRequired,
  selectedPreset: PropTypes.string,
};

LocationsDropdown.defaultProps = {
  selectedPreset: '',
};

export default LocationsDropdown;
