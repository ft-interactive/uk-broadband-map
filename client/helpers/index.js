/**
 * @file
 * Various helper utilities
 */

import { UK_BOUNDS } from '../state/reducers';

export const isOutsideTheUK = ({ coords }) => {
  const { latitude, longitude } = coords;
  const [boundsLon, boundsLat] = UK_BOUNDS;
  return (
    longitude < boundsLon[0] ||
    longitude > boundsLon[1] ||
    latitude < boundsLat[0] ||
    latitude > boundsLat[1]
  );
};

export default '';
