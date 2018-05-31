/**
 * @file
 * Main app component
 */

import React, { Component } from 'react';
import ReactMapGL, { FlyToInterpolator } from 'react-map-gl';
import * as d3 from 'd3-ease'; // eslint-disable-line
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';
import * as actions from '../../state/actions';
import GeographyLookup from './geography-lookup';
import Histogram from './histogram';
import Summary from './summary';
import Loader from './loader';
import ZoomControls from './zoom-controls';
import './styles.scss';

const MAPBOX_STYLE = 'mapbox://styles/financialtimes/cjg290kic7od82rn46o3o719e';
const MAPBOX_TOKEN = window.mapboxToken;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderComplete: false, // loaderComplete kept as part of state b/c impl. deet
      dragEnabled: false,
    };
    this.map = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
    this.initialiseMap();
    this.props.getSpeedData();
  }

  componentDidUpdate(oldProps) {
    const { longitude, latitude } = this.props.activeGeography;
    const { longitude: oldLong, latitude: oldLat } = oldProps.activeGeography;
    const zoom = 12;

    if (longitude !== oldLong && latitude !== oldLat) {
      this.goToViewport({ longitude, latitude, zoom });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onViewportChange = (viewport) => {
    const dragEnabled = viewport.zoom && viewport.zoom !== viewport.minZoom;

    this.props.updateViewport({ ...this.props.viewport, ...viewport });
    this.setState({ dragEnabled });
  };

  setPanBounds = () => {
    console.log('Getting initial map bounds…');

    const map = this.map.current.getMap();
    const bounds = map.getBounds();

    console.log('Got initial map bounds. Setting maximum bounds…');

    map.setMaxBounds(bounds);

    console.log(`Maximum bounds fixed at ${bounds._sw} (SW), ${bounds._ne} (NE).`); // eslint-disable-line
  };

  resize = () => {
    console.log('Viewport will resize…');

    const width = window.innerWidth;
    const height = window.innerHeight * 0.75;
    const viewport = new WebMercatorViewport({ width, height });
    const { zoom, minZoom } = this.props.viewport;
    const bound = viewport.fitBounds([[-8.655, 49.9], [1.79, 60.85000000000001]], { padding: 0 });

    if (zoom === minZoom) {
      this.onViewportChange({
        ...bound,
        minZoom: bound.zoom,
      });
    } else {
      this.onViewportChange({
        width,
        height,
        minZoom: bound.zoom,
      });
    }
  };

  initialiseMap = () => {
    const map = this.map.current.getMap();

    console.log('Loading map resources…');

    map.on('load', () => {
      console.log('Map resources loaded.');

      this.setPanBounds(map);
      this.props.setMapLoadedStatus(true);
    });
  };

  goToViewport = ({
    longitude = this.props.viewport.longitude,
    latitude = this.props.viewport.latitude,
    zoom,
  }) => {
    const { zoom: currentZoom } = this.props.viewport;
    const transitionDuration = Math.abs((zoom - currentZoom) * 500);

    console.log(`Transition duration: ${transitionDuration}`);

    this.onViewportChange({
      longitude,
      latitude,
      zoom,
      transitionDuration,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    });
  };

  handleLoaderComplete = () => {
    console.log('Loader opacity transition complete. Unmounting Loader…');

    this.setState({ loaderComplete: true });
  };

  render() {
    const { viewport, activeGeography, speeds, mapLoaded } = this.props;

    return (
      <div>
        <div className="o-grid-container">
          <div className="o-grid-row">
            <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
              <GeographyLookup
                raisePostcodeError={this.props.raisePostcodeError}
                getPostcodeData={this.props.getPostcodeData}
              />
            </div>
          </div>
        </div>

        <div className="map-container">
          {this.state.loaderComplete ? null : (
            <Loader mapLoaded={mapLoaded} handleLoaderComplete={this.handleLoaderComplete} />
          )}

          <ReactMapGL
            {...viewport}
            mapStyle={MAPBOX_STYLE}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            onViewportChange={this.onViewportChange}
            scrollZoom={false}
            dragPan={this.state.dragEnabled}
            dragRotate={false}
            doubleClickZoom={false}
            touchZoom={false}
            touchRotate={false}
            ref={this.map}
          >
            <ZoomControls
              zoom={viewport.zoom}
              minZoom={viewport.minZoom}
              onZoomChange={this.goToViewport}
              dragEnabled={this.state.dragEnabled}
            />
          </ReactMapGL>
        </div>

        <div className="o-grid-container">
          <div className="o-grid-row">
            <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
              <Histogram geography={activeGeography} speeds={speeds} />
              <Summary geography={activeGeography} speeds={speeds} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  activeGeography: PropTypes.shape({
    id: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    postcode: PropTypes.string,
  }),
  speeds: PropTypes.array,
  viewport: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    zoom: PropTypes.number,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
  }).isRequired,
  mapLoaded: PropTypes.bool.isRequired,

  // Action dispatchers from Redux
  updateViewport: PropTypes.func.isRequired,
  getPostcodeData: PropTypes.func.isRequired,
  getSpeedData: PropTypes.func.isRequired,
  setMapLoadedStatus: PropTypes.func.isRequired,
  raisePostcodeError: PropTypes.func.isRequired,
};

App.defaultProps = {
  activeGeography: {},
  speeds: [],
};

export default connect(state => state, actions)(App);
