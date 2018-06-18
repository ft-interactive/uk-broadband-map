import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import fscreen from 'fscreen';
import { Icon } from 'react-icons-kit';
import { ic_fullscreen } from 'react-icons-kit/md/ic_fullscreen'; // eslint-disable-line camelcase
import { ic_fullscreen_exit } from 'react-icons-kit/md/ic_fullscreen_exit'; // eslint-disable-line camelcase
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
    const { fullscreenStatus } = this.props;

    return (
      <div className="mapboxgl-ctrl mapboxgl-ctrl-group fullscreen-control">
        <button
          onClick={fscreen.fullscreenEnabled ? this.handleClick : this.handleClickNoAPI}
          title={fullscreenStatus ? 'Exit Full Screen' : 'Enter Full Screen with Scroll Zoom'}
          style={{ color: '#ffffff' }}
        >
          {fullscreenStatus ? (
            <Icon icon={ic_fullscreen_exit} size={30} /> // eslint-disable-line camelcase
          ) : (
            <Icon icon={ic_fullscreen} size={30} /> // eslint-disable-line camelcase
          )}
        </button>
      </div>
    );
  }
}

FullscreenControl.propTypes = {
  targetElement: PropTypes.instanceOf(window.HTMLElement).isRequired,
  onFullscreenChange: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  fullscreenStatus: PropTypes.bool.isRequired,
};

export default FullscreenControl;
