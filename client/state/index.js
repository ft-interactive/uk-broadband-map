/**
 * @file
 * Redux store
 */

import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import oTrackingMiddleware from './otracking-middleware';

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk, oTrackingMiddleware)),
);
