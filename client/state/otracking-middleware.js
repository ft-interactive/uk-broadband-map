/**
 * @file
 * Redux middleware for dispatching o-tracking events
 */

import {
  GET_POSTCODE_DATA,
  RAISE_POSTCODE_ERROR,
  RAISE_GEOLOCATION_ERROR,
  GET_USER_LOCATION,
  CHOOSE_PRESET,
  SET_FULLSCREEN_STATUS,
} from './actions';

const includedActionTypes = [
  GET_POSTCODE_DATA,
  RAISE_POSTCODE_ERROR,
  RAISE_GEOLOCATION_ERROR,
  GET_USER_LOCATION,
  CHOOSE_PRESET,
  SET_FULLSCREEN_STATUS,
];

// eslint-disable-next-line no-unused-vars
const oTrackingMiddleware = store => next => ({ type, ...action }) => {
  if (document && includedActionTypes.includes(type)) {
    document.body.dispatchEvent(
      new CustomEvent('oTracking.event', {
        detail: {
          category: 'interactive',
          action: type,
          // context: action, // Disabling due to GDPR worries
        },
        bubbles: true,
      }),
    );
  }
  return next({ type, ...action });
};

export default oTrackingMiddleware;
