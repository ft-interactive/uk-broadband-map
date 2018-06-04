import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';
import { scaleLinear } from 'd3-scale'; // eslint-disable-line
import { range as d3Range } from 'd3-array'; // eslint-disable-line
import './styles.scss';

// TODO: figure out how to set this without using state
const controlsHidden = false;

class ZoomControls extends PureComponent {
  constructor(props) {
    super(props);

    this.zoomScale = scaleLinear();
    this.slider = React.createRef();
  }

  componentDidUpdate() {
    const { zoomLevels } = this.props;
    const zoomSteps = d3Range(0, zoomLevels.length, 1);

    this.zoomScale
      .domain(zoomLevels)
      .range(zoomSteps);
  }

  handleZoomChange = (zoom) => {
    const { longitude, latitude, minZoom } = this.props.viewport;

    console.log('setting slider value', this.zoomScale(zoom));
    this.slider.current.value = this.zoomScale(zoom);

    console.log('new slider value', this.slider.current.value);

    if (zoom.toFixed(5) === minZoom.toFixed(5)) {
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
      longitude,
      latitude,
      zoom,
    });
  }

  handleButtonClick = (event) => {
    event.preventDefault();

    const zoomLevel = Number(event.target.value);

    this.handleZoomChange(zoomLevel);
  };

  handleSliderChange = (event) => {
    event.preventDefault();

    const zoomStep = Number(event.target.value);
    const zoomLevel = this.zoomScale.invert(zoomStep);

    this.handleZoomChange(zoomLevel);
  }

  renderZoomButton = (num) => {
    const { zoomLevels } = this.props;
    const { zoom: currentZoomLevel } = this.props.viewport;
    const currentZoomIndex = zoomLevels.indexOf(currentZoomLevel);
    let value;

    if (currentZoomIndex > -1) {
      value = num > -1 ? zoomLevels[currentZoomIndex + 1] : zoomLevels[currentZoomIndex - 1];
    } else {
      value = 'HURRRRR';
    }

    return (
      <button
        key={`zoom-${num > -1 ? 'plus' : 'minus'}`}
        value={value}
        onClick={this.handleButtonClick}
        className={`o-buttons o-buttons--inverse zoom-${num > -1 ? 'plus' : 'minus'} ${
          controlsHidden ? 'hidden' : ''
        }`}
      >
        {num > -1 ? '+' : '-'}
      </button>
    );
  };

  render() {
    const { zoomLevels } = this.props;
    const value = this.slider.current ? this.slider.current.value : 0;

    return (
      <Fragment>
        <div className="zoom-control-container">
          {[0, -1].map(x => this.renderZoomButton(x))}

          <div className="slider-wrapper">
            <input
              name="zoom"
              type="range"
              min={0}
              max={zoomLevels.length - 1}
              step={1}
              value={value}
              onChange={this.handleSliderChange}
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
  // dragEnabled: PropTypes.bool.isRequired,
};

ZoomControls.defaultProps = { minZoom: 0 };

export default ZoomControls;
