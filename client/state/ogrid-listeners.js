/**
 * @file
 * Redux listener pattern for adding o-grid change events to page
 */

import oGrid from 'o-grid/main'; /* eslint-disable-line */ // Bower FTL
import { setOgridLayout } from './actions';

export default (store) => {
  if (window) {
    oGrid.enableLayoutChangeEvents();
    store.dispatch(setOgridLayout(oGrid.getCurrentLayout()));
    window.addEventListener('o-grid.layoutChange', ({ detail }) => {
      store.dispatch(setOgridLayout(detail.layout));
    });
  }

  return store;
};
