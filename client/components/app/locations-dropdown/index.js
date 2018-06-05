/**
 * @file
 * Interesting locales dropdown box
 */

import React from 'react';
import PropTypes from 'prop-types';

const LocationsDropdown = ({ presets, selectedPreset, choosePreset }) => (
  <select
    className="locate-user__select"
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
