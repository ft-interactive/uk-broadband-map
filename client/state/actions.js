/**
 * @file
 * Redux actions
 */

export const GET_POSTCODE_DATA = 'GET_POSTCODE_DATA';
export const UPDATE_VIEWPORT = 'UPDATE_VIEWPORT';

export const getPostcodeData = postcode => dispatch =>
  fetch(`postcode/${postcode.replace(/\s/g, '').toUpperCase()}.json`)
    .then(res => res.json())
    .then(data =>
      dispatch({
        type: GET_POSTCODE_DATA,
        payload: data,
      }),
    );

export const updateViewport = viewport => ({
  type: UPDATE_VIEWPORT,
  payload: viewport,
});

export default '';
