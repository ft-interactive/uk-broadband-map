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
  SET_DRAGGABLE_STATUS,
  SET_TRANSITION_STATUS,
  CHOOSE_PRESET,
  SET_FULLSCREEN_STATUS,
} from './actions';

export const UK_BOUNDS = [[-8.655, 49.9], [1.79, 60.85000000000001]];

const INITIAL_STATE = {
  viewport: {
    width: 0,
    height: 0,
    longitude: -3.432,
    latitude: 55.757,
    zoom: 0,
    maxZoom: 15,
    minZoom: 0,
  },
  activeGeography: {},
  speeds: [],
  mapLoaded: false,
  loaderComplete: false,
  isTouch: !document.body.classList.contains('no-touchevents'),
  postcodeError: '',
  geolocatingInProgress: false,
  ukBounds: UK_BOUNDS,
  dragEnabled: false,
  transitionInProgress: false,
  selectedPreset: '',
  fullscreenEnabled: false,
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

    case SET_DRAGGABLE_STATUS:
      return {
        ...state,
        dragEnabled: payload,
      };

    case SET_TRANSITION_STATUS:
      return {
        ...state,
        transitionInProgress: payload,
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

    case SET_FULLSCREEN_STATUS:
      return {
        ...state,
        fullscreenEnabled: payload,
      };

    default:
      return {
        ...state,
      };
  }
};
