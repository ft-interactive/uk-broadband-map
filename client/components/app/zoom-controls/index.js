import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';
import { scaleThreshold, scaleLinear } from 'd3-scale'; // eslint-disable-line
import { axisRight } from 'd3-axis'; // eslint-disable-line
import * as d3 from 'd3-selection'; // eslint-disable-line
import { range as d3Range, min as d3Min, max as d3Max } from 'd3-array'; // eslint-disable-line
import { throttle } from 'lodash';
import './styles.scss';

// TODO: figure out how to set this without using state
const controlsHidden = false;

class ZoomControls extends PureComponent {
  constructor(props) {
    super(props);

    this.zoomScale = scaleThreshold();
    // this.axisScale = scaleLinear();
    // this.zoomAxis = axisRight(this.axisScale);
    this.sliderWrapper = React.createRef();
    this.slider = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(this.resize, 500));
  }

  componentDidUpdate() {
    const { zoomLevels } = this.props;
    const zoomLevelsCopy = zoomLevels.slice(0);

    zoomLevelsCopy.unshift(0);

    this.zoomScale.domain(zoomLevels).range(zoomLevelsCopy);

    // this.axisScale.domain([d3Max(zoomLevels), d3Min(zoomLevels)]).range([0, 100]);
    // d3.select('.zoom-axis').call(this.zoomAxis);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    console.log('Slider thumb will reposition…');

    const { zoom } = this.props.viewport;

    this.slider.current.value = zoom;
  };

  handleZoomChange = (zoom) => {
    const { zoomLevels } = this.props;
    const { width, height } = this.props.viewport;

    this.slider.current.value = zoom;

    if (zoom === Number(zoomLevels[0].toFixed(5))) {
      const viewport = new WebMercatorViewport({
        width,
        height,
      });
      const bound = viewport.fitBounds([[-8.655, 49.9], [1.79, 60.85000000000001]], { padding: 0 });

      return this.props.onZoomChange({
        longitude: bound.longitude,
        latitude: bound.latitude,
        zoom: bound.zoom,
      });
    }

    return this.props.onZoomChange({ zoom });
  };

  handleButtonClick = (event) => {
    event.preventDefault();

    const newZoomLevel = Number(event.target.value);

    this.handleZoomChange(newZoomLevel);
  };

  handleSliderChange = (event) => {
    event.preventDefault();

    const newZoomLevel = this.zoomScale(Number(event.target.value));

    this.handleZoomChange(newZoomLevel);
  };

  renderZoomButton = (num) => {
    const { zoomLevels, transitionInProgress } = this.props;
    const { zoom: currentZoomLevel } = this.props.viewport;
    const currentZoomStep = this.zoomScale(currentZoomLevel.toFixed(5));
    const currentZoomIndex = zoomLevels.indexOf(currentZoomStep);
    const value = num > 0 ? zoomLevels[currentZoomIndex + 1] : zoomLevels[currentZoomIndex - 1];

    return (
      <button
        key={`zoom-${num > 0 ? 'plus' : 'minus'}`}
        value={value}
        onClick={this.handleButtonClick}
        className={`o-buttons o-buttons--inverse zoom-${num > 0 ? 'plus' : 'minus'} ${
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

    return (
      <Fragment>
        <div className="zoom-control-container" ref={this.zoomControlContainer}>
          {/* Map an array of one positive and one negative integer */}
          {[1, -1].map(x => this.renderZoomButton(x))}

          <div className="slider-wrapper" ref={this.sliderWrapper}>
            <input
              type="range"
              min={zoomLevels[0]}
              max={zoomLevels[zoomLevels.length - 1]}
              step={'any'}
              value={zoomStep}
              onInput={this.handleSliderChange}
              ref={this.slider}
            />
          </div>

          {/* <svg height={this.sliderWrapper.current ? this.sliderWrapper.current.clientWidth : 0}>
            <g className="zoom-axis" />
          </svg> */}
        </div>
      </Fragment>
    );
  }
}

ZoomControls.propTypes = {
  viewport: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    zoom: PropTypes.number,
  }).isRequired,
  zoomLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
  onZoomChange: PropTypes.func.isRequired,
  transitionInProgress: PropTypes.bool.isRequired,
};

export default ZoomControls;
