/**
 * @file
 * Function-as-child component to render a series of URLs as images in a grid
 */

import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const ImageGrid = ({ children, images }) => (
  <section className="image-grid">{images.map(image => children(image))}</section>
);

ImageGrid.propTypes = {
  children: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      title: PropTypes.string,
    }),
  ),
};

ImageGrid.defaultProps = {
  images: [],
};

export default ImageGrid;
