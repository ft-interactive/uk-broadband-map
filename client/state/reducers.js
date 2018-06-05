/**
 * @file
 * Root reducer for Redux store
 */

import { easeCubic } from 'd3-ease';
import { FlyToInterpolator } from 'react-map-gl';

import {
  GEOLOCATING_IN_PROGRESS,
  GET_POSTCODE_DATA,
  GET_SPEED_DATA,
  GET_USER_LOCATION,
  RAISE_POSTCODE_ERROR,
  SET_MAP_LOADED_STATUS,
  UPDATE_VIEWPORT,
  CHOOSE_PRESET,
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
  isTouch: !document.body.classList.contains('no-touchevents'),
  postcodeError: '',
  geolocatingInProgress: false,
  ukBounds: UK_BOUNDS,
  selectedPreset: '',
};

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_POSTCODE_DATA:
      return {
        ...state,
        activeGeography: payload,
      };

    case GET_USER_LOCATION:
      const { postcode, region, ...rest } = payload;
      return {
        ...state,
        activeGeography: {
          postcode: postcode || 'unavailable',
          region,
          ...rest,
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

    case CHOOSE_PRESET:
      return {
        ...state,
        selectedPreset: payload.id,
        viewport: {
          ...state.viewport,
          ...payload.viewport,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: easeCubic,
        },
      };

    default:
      return {
        ...state,
      };
  }
};
