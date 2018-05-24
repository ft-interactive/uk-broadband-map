/**
 * @file
 * Root reducer for Redux store
 */

import { GET_POSTCODE_DATA, GET_SPEED_DATA, UPDATE_VIEWPORT, SET_MAP_LOADED_STATUS } from './actions';

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

    default:
      return {
        ...state,
      };
  }
};
