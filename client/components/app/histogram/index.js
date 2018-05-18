/**
 * @file
 * Histogram component
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function Histogram(props) {
  return <div>Histogram. Highlighted: {props.geography.postcode || 'none'}</div>;
}

Histogram.propTypes = {
  geography: PropTypes.any, // eslint-disable-line
};
