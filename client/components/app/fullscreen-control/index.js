import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

class FullscreenControl extends PureComponent {
  handleClick = (event) => {
    event.preventDefault();

    const { mapContainer, onResize, onFullscreenChange, fullscreenEnabled } = this.props;

    mapContainer.classList.toggle('fullscreen');
    document.body.classList.toggle('fullscreen-map');

    onResize();
    onFullscreenChange(!fullscreenEnabled);
  };

  render() {
    return <button onClick={this.handleClick}>fullscreen</button>;
  }
}

FullscreenControl.propTypes = {
  mapContainer: PropTypes.shape.isRequired,
  onResize: PropTypes.func.isRequired,
  onFullscreenChange: PropTypes.func.isRequired,
  fullscreenEnabled: PropTypes.bool.isRequired,
};

export default FullscreenControl;
