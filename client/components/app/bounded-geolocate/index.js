/**
 * @file
 * Extends the MapboxGL GeolocateControl
 */

import { GeolocateControl, LngLat } from 'mapbox-gl';
import { isOutsideTheUK } from '../../../helpers';

/* eslint-disable no-underscore-dangle */

class BoundedGeolocateControl extends GeolocateControl {
  _updateCamera(position) {
    if (isOutsideTheUK(position)) {
      this.fire('error', {
        error: new Error('Outside UK Bounds'),
      });

      this._userLocationDotMarker.remove(); // Remove marker

      const c = new LngLat(-0.0961675, 51.5089683); // FT Offices
      const radius = position.coords.accuracy;
      const bounds = c.toBounds(radius);

      // WTAFITS?
      const boundsArray = [[bounds._ne.lng, bounds._ne.lat], [bounds._sw.lng, bounds._sw.lat]];
      this._map.fitBounds(boundsArray, this.options.fitBoundsOptions, {
        // tag this camera change so it won't cause the control to change to background state
        geolocateSource: true,
      });
    } else {
      const c = new LngLat(position.coords.longitude, position.coords.latitude);
      const radius = position.coords.accuracy;
      const bounds = c.toBounds(radius);

      // Seriously?
      const boundsArray = [[bounds._ne.lng, bounds._ne.lat], [bounds._sw.lng, bounds._sw.lat]];
      this._map.fitBounds(boundsArray, this.options.fitBoundsOptions, {
        // tag this camera change so it won't cause the control to change to background state
        geolocateSource: true,
      });
    }
  }
}

export default BoundedGeolocateControl;
