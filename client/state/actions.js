/**
 * @file
 * Redux actions
 */

import { isOutsideTheUK } from '../helpers';

export const GET_POSTCODE_DATA = 'GET_POSTCODE_DATA';
export const GET_SPEED_DATA = 'GET_SPEED_DATA';
export const UPDATE_VIEWPORT = 'UPDATE_VIEWPORT';
export const SET_MAP_LOADED_STATUS = 'SET_MAP_LOADED_STATUS';
export const RAISE_POSTCODE_ERROR = 'RAISE_POSTCODE_ERROR';
export const GET_USER_LOCATION = 'GET_USER_LOCATION';
export const GEOLOCATING_IN_PROGRESS = 'GEOLOCATING_IN_PROGRESS';
export const SET_DRAGGABLE_STATUS = 'SET_DRAGGABLE_STATUS';
export const SET_TRANSITION_STATUS = 'SET_TRANSITION_STATUS';
export const CHOOSE_PRESET = 'CHOOSE_PRESET';
export const SET_FULLSCREEN_STATUS = 'SET_FULLSCREEN_STATUS';

export const raisePostcodeError = err => ({
  type: RAISE_POSTCODE_ERROR,
  payload: err.message,
});

export const getPostcodeData = postcode => dispatch =>
  fetch(`${process.env.ENDPOINT || ''}postcode/${postcode.replace(/\s/g, '').toUpperCase()}.json`)
    .then((res) => {
      if (!res.ok) throw new Error('Invalid postcode');
      return res.json();
    })
    .then((data) => {
      if (data['Maximum_download_speed_(Mbit/s)'] === 'NA') {
        throw new Error('Data is redacted due to small population size');
      }

      return dispatch({
        type: GET_POSTCODE_DATA,
        payload: {
          ...data,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude), // Ensure type safety
        },
      });
    })
    .catch(err => dispatch(raisePostcodeError(err)));

export const getSpeedData = () => dispatch =>
  import('../../speeds.json').then(data =>
    dispatch({
      type: GET_SPEED_DATA,
      payload: Object.values(data),
    }),
  );

export const getUserLocation = () => async (dispatch) => {
  try {
    await dispatch({
      type: GEOLOCATING_IN_PROGRESS,
      payload: true,
    });

    if ('geolocation' in navigator) {
      const { coords } = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
      );

      if (isOutsideTheUK(coords)) {
        throw new Error('Outside UK Bounds');
      }

      // Try to get postcode via lat/lng
      const postcodesIOResponse = await fetch(
        `https://api.postcodes.io/postcodes?lon=${coords.longitude}&lat=${coords.latitude}`,
      ).then(res => res.json());

      if (postcodesIOResponse.status === 200) {
        const [postcodeData] = postcodesIOResponse.result;

        await dispatch({
          type: GET_USER_LOCATION,
          payload: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            ...postcodeData,
          },
        });

        await dispatch(getPostcodeData(postcodeData.postcode));
      } else {
        await dispatch({
          type: GET_USER_LOCATION,
          payload: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
      }

      await dispatch({
        type: GEOLOCATING_IN_PROGRESS,
        payload: false,
      });
    } else {
      throw new Error('Geolocation is unavailable');
    }
  } catch (e) {
    if (e.message === 'Outside UK Bounds') {
      console.log('Outside UK bounds. Setting to FT offices');
      await dispatch({
        type: GET_USER_LOCATION,
        payload: {
          latitude: 51.5089683,
          longitude: -0.0961675,
        },
      });

      await dispatch({
        type: GEOLOCATING_IN_PROGRESS,
        payload: false,
      });
    } else {
      console.error(e);
    }
  }
};

export const updateViewport = viewport => ({
  type: UPDATE_VIEWPORT,
  payload: viewport,
});

export const setMapLoadedStatus = status => ({
  type: SET_MAP_LOADED_STATUS,
  payload: status,
});

export const setDraggableStatus = isDraggable => ({
  type: SET_DRAGGABLE_STATUS,
  payload: isDraggable,
});

export const setTransitionStatus = transitionInProgress => ({
  type: SET_TRANSITION_STATUS,
  payload: transitionInProgress,
});

export const choosePreset = preset => ({
  type: CHOOSE_PRESET,
  payload: preset,
});

export const setFullscreenStatus = isFullscreen => ({
  type: SET_FULLSCREEN_STATUS,
  payload: isFullscreen,
});

export default '';
