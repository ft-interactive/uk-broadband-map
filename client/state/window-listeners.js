/**
 * @file
 * Redux listener pattern for adding o-grid change events to page
 */

import oGrid from 'o-grid/main'; /* eslint-disable-line */ // Bower FTL
import debounce from 'lodash.debounce';
import { setOgridLayout, setPageWidth } from './actions';

export default (store) => {
  if (window) {
    oGrid.enableLayoutChangeEvents();
    store.dispatch(setOgridLayout(oGrid.getCurrentLayout()));
    store.dispatch(setPageWidth(window.innerWidth));

    window.addEventListener('o-grid.layoutChange', ({ detail }) => {
      store.dispatch(setOgridLayout(detail.layout));
    });

    window.addEventListener(
      'resize',
      debounce(() => store.dispatch(setPageWidth(window.innerWidth)), 1000),
    );
  }

  return store;
};
