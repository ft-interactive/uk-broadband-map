/**
 * @file
 * Function-as-child component to render a series of URLs as images in a grid
 */

import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const ImageGrid = ({ children, images, caption }) => (
  <div data-o-grid-colspan="12">
    <section className="image-grid">{images.map(image => children(image))}</section>
    <figcaption>
      FT graphic: {caption.names.join(', ')}&nbsp; Source: {caption.source}
      <br />&copy; FT
    </figcaption>
  </div>
);

ImageGrid.propTypes = {
  children: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
      title: PropTypes.string,
      alt: PropTypes.string.isRequired,
    }),
  ),
  caption: PropTypes.shape({
    names: PropTypes.arrayOf(PropTypes.string),
    source: PropTypes.string,
  }),
};

ImageGrid.defaultProps = {
  images: [],
  caption: {
    names: ['Interactive Graphics'],
    source: '',
  },
};

export default ImageGrid;
