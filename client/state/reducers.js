/**
 * @file
 * Root reducer for Redux store
 */

import {
  GEOLOCATING_IN_PROGRESS,
  GET_POSTCODE_DATA,
  GET_SPEED_DATA,
  GET_USER_LOCATION,
  RAISE_POSTCODE_ERROR,
  SET_MAP_LOADED_STATUS,
  UPDATE_VIEWPORT,
} from './actions';

export const UK_BOUNDS = [[-7.57216793459, 49.959999905], [1.68153079591, 58.6350001085]];

const INITIAL_STATE = {
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight * 0.6,
    longitude: -2.5,
    latitude: 54.5,
    zoom: 0,
    maxZoom: 14,
  },
  activeGeography: {},
  speeds: [],
  mapLoaded: false,
  loaderComplete: false,
  postcodeError: '',
  geolocatingInProgress: false,
  ukBounds: UK_BOUNDS,
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_POSTCODE_DATA:
      return {
        ...state,
        activeGeography: payload,
      };

    case GET_USER_LOCATION:
      return {
        ...state,
        activeGeography: {
          ...payload,
          postcode: '<geolocated>',
        },
      };

    case GEOLOCATING_IN_PROGRESS:
      return {
        ...state,
        geolocatingInProgress: payload,
      };

    case GET_SPEED_DATA:
      return {
        ...state,
        speeds: payload,
      };

    case UPDATE_VIEWPORT:
      return {
        ...state,
        viewport: payload,
      };

    case SET_MAP_LOADED_STATUS:
      return {
        ...state,
        mapLoaded: payload,
      };

    case RAISE_POSTCODE_ERROR:
      return {
        ...state,
        postcodeError: payload,
      };

    default:
      return {
        ...state,
      };
  }
};
