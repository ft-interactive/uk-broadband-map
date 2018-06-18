/**
 * @file
 * Redux actions
 */

export const GET_POSTCODE_DATA = 'GET_POSTCODE_DATA';
export const GET_SPEED_DATA = 'GET_SPEED_DATA';
export const UPDATE_VIEWPORT = 'UPDATE_VIEWPORT';
export const SET_MAP_LOADED_STATUS = 'SET_MAP_LOADED_STATUS';
export const RAISE_POSTCODE_ERROR = 'RAISE_POSTCODE_ERROR';
export const RAISE_GEOLOCATION_ERROR = 'RAISE_GEOLOCATION_ERROR';
export const GET_USER_LOCATION = 'GET_USER_LOCATION';
export const GEOLOCATING_IN_PROGRESS = 'GEOLOCATING_IN_PROGRESS';
export const SET_DRAGGABLE_STATUS = 'SET_DRAGGABLE_STATUS';
export const SET_TRANSITION_STATUS = 'SET_TRANSITION_STATUS';
export const CHOOSE_PRESET = 'CHOOSE_PRESET';
export const SET_FULLSCREEN_STATUS = 'SET_FULLSCREEN_STATUS';
export const HIDE_LOADING_SCREEN = 'HIDE_LOADING_SCREEN';
export const CLEAR_SELECTED_PRESET = 'CLEAR_SELECTED_PRESET';
export const UPDATE_POSTCODE_INPUT_VALUE = 'UPDATE_POSTCODE_INPUT_VALUE';
export const CLEAR_MARKER = 'CLEAR_MARKER';

export const raisePostcodeError = err => ({
  type: RAISE_POSTCODE_ERROR,
  payload: err.message,
});

export const clearPostcodeError = () => ({
  type: RAISE_POSTCODE_ERROR,
  payload: '',
});

export const updatePostcodeInputValue = payload => ({
  type: UPDATE_POSTCODE_INPUT_VALUE,
  payload,
});

export const clearPostcodeInputValue = () => ({
  type: UPDATE_POSTCODE_INPUT_VALUE,
  payload: '',
});

export const raiseGeolocationError = err => ({
  type: RAISE_GEOLOCATION_ERROR,
  payload: err.message || 'Unable to geolocate',
});

export const clearGeolocationError = () => ({
  type: RAISE_GEOLOCATION_ERROR,
  payload: '',
});

export const clearSelectedPreset = () => ({
  type: CLEAR_SELECTED_PRESET,
});

export const loadingComplete = () => ({
  type: HIDE_LOADING_SCREEN,
  payload: true,
});

export const getPostcodeData = postcode => dispatch =>
  fetch(`${process.env.ENDPOINT || ''}postcode/${postcode.replace(/\s/g, '').toUpperCase()}.json`)
    .then((res) => {
      if (!res.ok) throw new Error('Invalid postcode');
      return res.json();
    })
    .then(async (data) => {
      await dispatch(clearPostcodeError());
      await dispatch(clearGeolocationError());
      await dispatch(clearSelectedPreset());
      await dispatch({
        type: GET_POSTCODE_DATA,
        payload: {
          ...data,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude), // Ensure type safety
        },
      });

      if (data['Maximum_download_speed_(Mbit/s)'] === 'NA') {
        throw new Error('Data is redacted due to small population size');
      }
    })
    .catch(err => dispatch(raisePostcodeError(err)));

export const getSpeedData = () => dispatch =>
  import('../../speeds.json').then(data =>
    dispatch({
      type: GET_SPEED_DATA,
      payload: Object.values(data),
    }),
  );

export const clearMarker = () => ({
  type: CLEAR_MARKER,
});

export const getUserLocation = coords => async (dispatch) => {
  try {
    await dispatch(clearMarker());
    await dispatch(clearPostcodeInputValue());
    await dispatch(clearGeolocationError());
    await dispatch(clearPostcodeError());
    await dispatch({
      type: GEOLOCATING_IN_PROGRESS,
      payload: true,
    });

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
  } catch (e) {
    await dispatch(raiseGeolocationError(e));
    await dispatch({
      type: GEOLOCATING_IN_PROGRESS,
      payload: false,
    });
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

export const choosePreset = preset => async (dispatch) => {
  try {
    await dispatch(clearPostcodeInputValue());
    await dispatch(clearGeolocationError());
    await dispatch(clearPostcodeError());
    await dispatch(clearMarker());
    return await dispatch({
      type: CHOOSE_PRESET,
      payload: preset,
    });
  } catch (e) {
    return console.error(e);
  }
};

export const setFullscreenStatus = isFullscreen => ({
  type: SET_FULLSCREEN_STATUS,
  payload: isFullscreen,
});

export default '';
