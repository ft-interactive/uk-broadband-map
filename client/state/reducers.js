/**
 * @file
 * Root reducer for Redux store
 */

import { GET_POSTCODE_DATA, UPDATE_VIEWPORT, SET_MAP_LOADED_STATUS } from './actions';

const INITIAL_STATE = {
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    longitude: -2.5,
    latitude: 54.5,
    zoom: 5,
    maxZoom: 10,
    minZoom: 5,
  },
  activeGeography: {},
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
