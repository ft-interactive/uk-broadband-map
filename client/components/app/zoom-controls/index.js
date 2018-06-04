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
  }

  componentDidUpdate() {
    const { zoomLevels } = this.props;
    const zoomSteps = d3Range(0, zoomLevels.length, 1);

    this.zoomScale
      .domain(zoomLevels)
      .range(zoomSteps);
  }

  handleZoomClick = (event) => {
    const zoom = Number(event.target.value);
    const { longitude, latitude, minZoom } = this.props.viewport;

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
  };

  handleZoomChange = (event) => {
    const { zoomLevels } = this.props;
    const zoomStep = Math.round(event.target.value);

    return this.props.onZoomChange({ zoom: zoomLevels[zoomStep] });
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
        onClick={this.handleZoomClick}
        className={`o-buttons o-buttons--inverse zoom-${num > -1 ? 'plus' : 'minus'} ${
          controlsHidden ? 'hidden' : ''
        }`}
      >
        {num > -1 ? '+' : '-'}
      </button>
    );
  };

  render() {
    const { zoom, maxZoom, minZoom } = this.props.viewport;

    return (
      <Fragment>
        <div className="zoom-control-container">
          {[0, -1].map(x => this.renderZoomButton(x))}

          <div className="slider-wrapper">
            <input
              name="zoom"
              type="range"
              min={this.zoomScale(minZoom)}
              max={this.zoomScale(maxZoom)}
              step={1}
              value={this.zoomScale(zoom)}
              onChange={this.handleZoomChange}
            />
          </div>
        </div>

        {/* {zoom.toFixed(2)} */}
      </Fragment>
    );
  }
}

ZoomControls.propTypes = {
  viewport: PropTypes.object.isRequired, // eslint-disable-line
  zoomLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
  onZoomChange: PropTypes.func.isRequired,
  dragEnabled: PropTypes.bool.isRequired,
};

ZoomControls.defaultProps = { minZoom: 0 };

export default ZoomControls;
