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
  RAISE_GEOLOCATION_ERROR,
  SET_FULLSCREEN_STATUS,
  HIDE_LOADING_SCREEN,
  CLEAR_SELECTED_PRESET,
  UPDATE_POSTCODE_INPUT_VALUE,
  CLEAR_MARKER,
  SET_OGRID_LAYOUT,
  SET_PAGE_WIDTH,
} from './actions';

export const UK_BOUNDS = [[-7.57216793459, 49.959999905], [1.68153079591, 58.6350001085]];

export const INITIAL_STATE = {
  viewport: {
    width: 0,
    height: 0,
    longitude: -3.432,
    latitude: 55.757,
    zoom: 0,
    maxZoom: 12,
    minZoom: 0,
    transitionDuration: 3000,
    transitionInterpolator: new FlyToInterpolator(),
    transitionEasing: easeCubic,
  },
  activeGeography: {},
  speeds: [],
  mapLoaded: false,
  doneLoading: false,
  isTouch: !document.body.classList.contains('no-touchevents'),
  postcodeError: '',
  geolocationError: '',
  geolocatingInProgress: false,
  ukBounds: UK_BOUNDS,
  dragEnabled: false,
  transitionInProgress: false,
  selectedPreset: '',
  controlsHidden: false,
  fullscreenEnabled: false,
  oGridLayout: 'default',
  pageWidth: null,
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
        postcodeInputValue: postcode || 'postcode unavailable',
        activeGeography: {
          postcode: postcode || 'unavailable',
          region,
          ...rest,
        },
      };

    case UPDATE_POSTCODE_INPUT_VALUE:
      return {
        ...state,
        postcodeInputValue: payload,
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
        viewport: {
          ...state.viewport,
          ...payload,
        },
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

    case RAISE_GEOLOCATION_ERROR:
      return {
        ...state,
        geolocationError: payload,
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
        activeGeography: {
          region: payload.region,
        },
        viewport: {
          ...state.viewport,
          ...payload.viewport,
          transitionDuration: INITIAL_STATE.viewport.transitionDuration * 2,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: easeCubic,
        },
      };

    case CLEAR_SELECTED_PRESET:
      return {
        ...state,
        selectedPreset: '',
      };

    case SET_FULLSCREEN_STATUS:
      return {
        ...state,
        fullscreenEnabled: payload,
      };

    case HIDE_LOADING_SCREEN:
      return {
        ...state,
        doneLoading: payload,
      };

    case CLEAR_MARKER:
      return {
        ...state,
        activeGeography: {
          ...state.activeGeography,
          latitude: undefined,
          longitude: undefined,
        },
      };

    case SET_OGRID_LAYOUT:
      return {
        ...state,
        oGridLayout: payload,
      };

    case SET_PAGE_WIDTH:
      return {
        ...state,
        pageWidth: payload,
      };

    default:
      return {
        ...state,
      };
  }
};
