import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';
import { scaleThreshold } from 'd3-scale'; // eslint-disable-line
import { range as d3Range, min as d3Min, max as d3Max } from 'd3-array'; // eslint-disable-line
import './styles.scss';

// TODO: figure out how to set this without using state
const controlsHidden = false;

class ZoomControls extends PureComponent {
  constructor(props) {
    super(props);

    this.zoomScale = scaleThreshold();
    this.slider = React.createRef();
  }

  componentDidUpdate() {
    const { zoomLevels } = this.props;

    this.zoomScale
      .domain(zoomLevels);

    zoomLevels.unshift(0);

    this.zoomScale
      .range(zoomLevels);
  }

  handleZoomChange = (zoom) => {
    const { longitude, latitude, minZoom } = this.props.viewport;

    this.slider.current.value = zoom;

    if (zoom === Number(minZoom.toFixed(5))) {
      const viewport = new WebMercatorViewport({
        width: window.innerWidth,
        height: window.innerHeight * 0.75,
      });
      const bound = viewport.fitBounds([[-8.655, 49.9], [1.79, 60.85000000000001]], { padding: 0 });

      return this.props.onZoomChange({
        longitude: bound.longitude,
        latitude: bound.latitude,
        zoom: bound.zoom,
      });
    }

    return this.props.onZoomChange({
      zoom,
    });
  }

  handleButtonClick = (event) => {
    event.preventDefault();

    const newZoomLevel = Number(event.target.value);

    this.handleZoomChange(newZoomLevel);
  };

  handleSliderChange = (event) => {
    event.preventDefault();

    const newZoomLevel = this.zoomScale(Number(event.target.value));

    this.handleZoomChange(newZoomLevel);
  }

  renderZoomButton = (num) => {
    const { zoomLevels, transitionInProgress } = this.props;
    const { zoom: currentZoomLevel } = this.props.viewport;
    const currentZoomStep = this.zoomScale(currentZoomLevel.toFixed(5));
    const currentZoomIndex = zoomLevels.indexOf(currentZoomStep);
    const value = num > 0 ? zoomLevels[currentZoomIndex + 1] : zoomLevels[currentZoomIndex - 1];

    return (
      <button
        key={`zoom-${num > -1 ? 'plus' : 'minus'}`}
        value={value}
        onClick={this.handleButtonClick}
        className={`o-buttons o-buttons--inverse zoom-${num > -1 ? 'plus' : 'minus'} ${
          controlsHidden ? 'hidden' : ''
        }`}
        disabled={!value || transitionInProgress}
      >
        {value}
      </button>
    );
  };

  render() {
    const { zoomLevels } = this.props;
    const zoomStep = this.slider.current ? this.slider.current.value : 0;
    // const zoomStep = this.props.viewport.zoom;

    return (
      <Fragment>
        <div className="zoom-control-container">
          {/* Map an array of plus/minus increments */}
          {[1, -1].map(x => this.renderZoomButton(x))}

          <div className="slider-wrapper">
            <input
              name="zoom"
              type="range"
              min={zoomLevels[0]}
              max={zoomLevels[zoomLevels.length - 1]}
              step={'any'}
              value={zoomStep}
              onInput={this.handleSliderChange}
              ref={this.slider}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

ZoomControls.propTypes = {
  viewport: PropTypes.object.isRequired, // eslint-disable-line
  zoomLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
  onZoomChange: PropTypes.func.isRequired,
  transitionInProgress: PropTypes.bool.isRequired,
};

ZoomControls.defaultProps = { viewport: { zoom: 0 } };

export default ZoomControls;
