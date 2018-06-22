/**
 * @file
 * Function-as-child component to render a series of URLs as images in a grid
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-slick';
import './styles.scss';

const ImageGrid = ({ children, images, caption }) => (
  <Fragment>
    <div data-o-grid-colspan="hide M12">
      <section className="image-grid">{images.map(image => children(image))}</section>
      {caption && (
        <figcaption>
          FT graphic: {caption.names.join(', ')}&nbsp; Source: {caption.source}
          <br />&copy; FT
        </figcaption>
      )}
    </div>
    <div className="image-grid-carousel" data-o-grid-colspan="12 Mhide center">
      <Carousel
        infinite
        fade
        autoplay
        dots={false}
        arrows={false}
        speed={900}
        slidesToShow={1}
        cssEase="cubic-bezier(0.7, 0, 0.3, 1)"
        touchThreshold={100}
      >
        {images.map(image => children(image))}
      </Carousel>
    </div>
  </Fragment>
);

ImageGrid.propTypes = {
  children: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
      title: PropTypes.string,
      alt: PropTypes.string.isRequired,
      srcSet: PropTypes.string,
      sizes: PropTypes.string,
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
