/**
 * @file
 * Interesting locales dropdown box
 */

import React from 'react';
import PropTypes from 'prop-types';

const LocationsDropdown = ({ presets, selectedPreset, choosePreset }) => (
  <select className="locate-user__select" value={selectedPreset} onChange={choosePreset}>
    <option value-="">Select preset view</option>
    {presets.map(location => (
      <option key={location.id} value={location}>
        {location.label}
      </option>
    ))}
  </select>
);

LocationsDropdown.propTypes = {
  presets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  choosePreset: PropTypes.func.isRequired,
  selectedPreset: PropTypes.string,
};

LocationsDropdown.defaultProps = {
  selectedPreset: '',
};

export default LocationsDropdown;
