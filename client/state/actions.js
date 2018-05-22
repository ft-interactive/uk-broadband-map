/**
 * @file
 * Redux actions
 */

export const GET_POSTCODE_DATA = 'GET_POSTCODE_DATA';
export const GET_SPEED_DATA = 'GET_SPEED_DATA';
export const UPDATE_VIEWPORT = 'UPDATE_VIEWPORT';
export const SET_MAP_LOADED_STATUS = 'SET_MAP_LOADED_STATUS';

export const getPostcodeData = postcode => dispatch =>
  fetch(`${process.env.ENDPOINT || ''}postcode/${postcode.replace(/\s/g, '').toUpperCase()}.json`)
    .then(res => res.json())
    .then(data =>
      dispatch({
        type: GET_POSTCODE_DATA,
        payload: {
          ...data,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude), // Ensure type safety
        },
      }),
    );

export const getSpeedData = () => dispatch =>
  fetch('/speeds.json')
    .then(response => response.json())
    .then(data => {
      dispatch({
        type: GET_SPEED_DATA,
        payload: data,
      });
    });

export const updateViewport = viewport => ({
  type: UPDATE_VIEWPORT,
  payload: viewport,
});

export const setMapLoadedStatus = status => ({
  type: SET_MAP_LOADED_STATUS,
  payload: status,
});

export default '';
