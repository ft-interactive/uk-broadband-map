/**
 * @file
 * Extends the MapboxGL GeolocateControl
 */

import { GeolocateControl, LngLat } from 'mapbox-gl';
import { isOutsideTheUK } from '../../../helpers';

class BoundedGeolocateControl extends GeolocateControl {
  _updateCamera(position) {
    if (isOutsideTheUK(position)) {
      this.fire('error', {
        error: new Error('Outside UK Bounds'),
      });

      // eslint-disable-next-line
      this._userLocationDotMarker.remove(); // Remove marker

      const center = new LngLat(-0.0961675, 51.5089683); // FT Offices
      const radius = position.coords.accuracy;

      // eslint-disable-next-line
      this._map.fitBounds(center.toBounds(radius), this.options.fitBoundsOptions, {
        // eslint-disable-next-line
        geolocateSource: true, // tag this camera change so it won't cause the control to change to background state // eslint-disable-line
      });
    } else {
      const center = new LngLat(position.coords.longitude, position.coords.latitude);
      const radius = position.coords.accuracy;
      // eslint-disable-next-line
      this._map.fitBounds(center.toBounds(radius), this.options.fitBoundsOptions, {
        // eslint-disable-next-line
        geolocateSource: true, // tag this camera change so it won't cause the control to change to background state // eslint-disable-line
      });
    }
  }
}

export default BoundedGeolocateControl;
