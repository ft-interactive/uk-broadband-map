/**
 * @file
 * Sundry custom PropTypes
 */

import PropTypes from 'prop-types';

export const propTypeSpeed = PropTypes.shape({
  megabit: PropTypes.number.isRequired,
  'national-rural': PropTypes.number.isRequired,
  'national-urban': PropTypes.number.isRequired,
  'ee-rural': PropTypes.number.isRequired,
  'ee-urban': PropTypes.number.isRequired,
  'em-rural': PropTypes.number.isRequired,
  'em-urban': PropTypes.number.isRequired,
  'london-rural': PropTypes.number.isRequired,
  'london-urban': PropTypes.number.isRequired,
  'ne-rural': PropTypes.number.isRequired,
  'ne-urban': PropTypes.number.isRequired,
  'nw-rural': PropTypes.number.isRequired,
  'nw-urban': PropTypes.number.isRequired,
  'scotland-rural': PropTypes.number.isRequired,
  'scotland-urban': PropTypes.number.isRequired,
  'se-rural': PropTypes.number.isRequired,
  'se-urban': PropTypes.number.isRequired,
  'sw-rural': PropTypes.number.isRequired,
  'sw-urban': PropTypes.number.isRequired,
  'wales-rural': PropTypes.number.isRequired,
  'wales-urban': PropTypes.number.isRequired,
  'wm-rural': PropTypes.number.isRequired,
  'wm-urban': PropTypes.number.isRequired,
  'yh-rural': PropTypes.number.isRequired,
  'yh-urban': PropTypes.number.isRequired,
});

export const propTypeActiveGeography = PropTypes.shape({
  id: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  postcode: PropTypes.string,
});

// @TODO can this be inferred from the map component?
export const propTypeViewport = PropTypes.shape({
  width: PropTypes.number,
  height: PropTypes.number,
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  zoom: PropTypes.number,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
});

export default '';
