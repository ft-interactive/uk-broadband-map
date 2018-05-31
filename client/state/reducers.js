/**
 * @file
 * Root reducer for Redux store
 */

import {
  GET_POSTCODE_DATA,
  GET_SPEED_DATA,
  UPDATE_VIEWPORT,
  SET_MAP_LOADED_STATUS,
  RAISE_POSTCODE_ERROR,
} from './actions';

const INITIAL_STATE = {
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight * 0.75,
    longitude: -2.5,
    latitude: 54.5,
    zoom: 0,
    maxZoom: 15,
    minZoom: 0,
  },
  activeGeography: {},
  speeds: [],
  mapLoaded: false,
  loaderComplete: false,
  postcodeError: '',
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_POSTCODE_DATA:
      return {
        ...state,
        activeGeography: payload,
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
