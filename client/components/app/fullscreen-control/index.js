import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import fscreen from 'fscreen';
import './styles.scss';

class FullscreenControl extends PureComponent {
  componentDidMount() {
    if (fscreen.fullscreenEnabled) {
      fscreen.addEventListener('fullscreenchange', this.handleFullscreenChange, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('fullscreenchange', this.handleClick);
  }

  handleFullscreenChange = () => {
    const { targetElement, onFullscreenChange, onResize } = this.props;

    targetElement.classList.toggle('fullscreen');

    onResize();

    if (fscreen.fullscreenElement !== null) {
      console.log('Entered full screen');

      onFullscreenChange(true);
    } else {
      console.log('Exited full screen');

      onFullscreenChange(false);
    }
  };

  handleClick = (event) => {
    event.preventDefault();

    const { targetElement } = this.props;

    if (fscreen.fullscreenElement === null) {
      fscreen.requestFullscreen(targetElement);
    } else {
      fscreen.exitFullscreen();
    }
  };

  handleClickNoAPI = (event) => {
    event.preventDefault();

    const { targetElement, onFullscreenChange, onResize, fullscreenStatus } = this.props;

    targetElement.classList.toggle('faux-fullscreen');
    document.body.classList.toggle('faux-fullscreen-body');

    onResize();

    onFullscreenChange(!fullscreenStatus);
  };

  render() {
    return (
      <button
        onClick={fscreen.fullscreenEnabled ? this.handleClick : this.handleClickNoAPI}
        title="Enter Full Screen with Scroll Zoom"
      >
        {fscreen.fullscreenEnabled ? 'fullscreen' : 'faux fullscreen'}
      </button>
    );
  }
}

FullscreenControl.propTypes = {
  targetElement: PropTypes.shape.isRequired,
  onFullscreenChange: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  fullscreenStatus: PropTypes.bool.isRequired,
};

export default FullscreenControl;
