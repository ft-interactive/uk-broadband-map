/**
 * @file
 * Redux store
 */

import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import oTrackingMiddleware from './otracking-middleware';
import addOGridListeners from './ogrid-listeners';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk, oTrackingMiddleware)),
);

export default addOGridListeners(store);
