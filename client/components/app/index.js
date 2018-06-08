/**
 * @file
 * Main app component
 */

import React, { Component, Fragment } from 'react';
import ReactMapGL, { FlyToInterpolator, NavigationControl } from 'react-map-gl';
import * as d3 from 'd3-ease'; // eslint-disable-line
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';
import { throttle } from 'lodash';
import mapboxgl from 'mapbox-gl';
import * as actions from '../../state/actions';
import GeographyLookup from './geography-lookup';
import Histogram from './histogram';
import Summary from './summary';
import Loader from './loader';
import ZoomControls from './zoom-controls';
import ImageGrid from './image-grid';
import LocationsDropdown from './locations-dropdown';
import './styles.scss';

const MAPBOX_STYLE = 'mapbox://styles/financialtimes/cjg290kic7od82rn46o3o719e';
const MAPBOX_TOKEN = window.mapboxToken;
const threshold = 0;

// @TODO replace
const imageGrid1Images = require('./image-grid/placeholders.json');
const presets = require('./locations-dropdown/locations.json');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaderComplete: false, // loaderComplete kept as part of state b/c impl. deet
    };
    this.mapContainer = React.createRef();
    this.map = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', throttle(this.resize, 500));
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
    // const zoom = viewport.zoom || this.props.viewport.zoom;
    // const minZoom = viewport.minZoom || this.props.viewport.minZoom;
    // const dragEnabled = zoom.toFixed(5) !== minZoom.toFixed(5);
    const [bottomRight, topLeft] = this.props.ukBounds;
    const [minLon, minLat] = bottomRight;
    const [maxLon, maxLat] = topLeft;

    /* eslint-disable no-param-reassign */
    if (viewport.longitude > maxLon + threshold) {
      viewport.longitude = maxLon;
    }
    if (viewport.longitude < minLon - threshold) {
      viewport.longitude = minLon;
    }
    if (viewport.latitude > maxLat + threshold) {
      viewport.latitude = maxLat;
    }
    if (viewport.latitude < minLat - threshold) {
      viewport.latitude = minLat;
    }
    /* eslint-enable */

    this.props.updateViewport({ ...this.props.viewport, ...viewport });
    // this.props.setDraggableStatus(dragEnabled);
  };

  resize = () => {
    console.log('Viewport will resize…');

    const width = this.mapContainer.current.offsetWidth;
    const height = this.mapContainer.current.offsetHeight;
    const viewport = new WebMercatorViewport({ width, height });
    const { zoom, minZoom } = this.props.viewport;
    const bound = viewport.fitBounds(this.props.ukBounds, { padding: 0 });

    if (zoom.toFixed(5) === minZoom.toFixed(5)) {
      this.onViewportChange({
        ...bound,
        minZoom: bound.zoom,
        transitionDuration: 0,
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
    const scale = new mapboxgl.ScaleControl({ unit: 'imperial' });

    console.log('Loading map resources…');

    map.on('load', () => {
      console.log('Map resources loaded.');

      map.addControl(scale);

      this.props.setMapLoadedStatus(true);
    });
  };

  goToViewport = ({
    longitude = this.props.viewport.longitude,
    latitude = this.props.viewport.latitude,
    zoom,
  }) => {
    console.log('gotoviewport');
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

  handleFullscreenClick = (event) => {
    event.preventDefault();

    const { fullscreenEnabled } = this.props;

    this.mapContainer.current.classList.toggle('fullscreen');

    document.body.classList.toggle('fullscreen-map');

    this.resize();

    this.props.setFullscreenStatus(!fullscreenEnabled);
  };

  render() {
    const {
      activeGeography,
      geolocatingInProgress,
      getPostcodeData,
      getUserLocation,
      mapLoaded,
      raisePostcodeError,
      speeds,
      viewport,
      selectedPreset,
      choosePreset,
      // dragEnabled,
      // setTransitionStatus,
      // transitionInProgress,
      fullscreenEnabled,
    } = this.props;

    return (
      <Fragment>
        {window.PRELOADED_COPY.map((el, idx) => {
          switch (el) {
            case '<!-- Postcode input, Mapbox map and dynamic histogram -->':
              return (
                <Fragment key="map">
                  <div className="o-grid-container">
                    <div className="o-grid-row">
                      <div className="locate-user">
                        <GeographyLookup
                          goToViewport={this.goToViewport}
                          raisePostcodeError={raisePostcodeError}
                          getPostcodeData={getPostcodeData}
                          getUserLocation={getUserLocation}
                          geolocatingInProgress={geolocatingInProgress}
                        />
                        <span>OR</span>
                        <LocationsDropdown
                          presets={presets}
                          selectedPreset={selectedPreset}
                          choosePreset={choosePreset}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="map-container" ref={this.mapContainer}>
                    {this.state.loaderComplete ? null : (
                      <Loader
                        mapLoaded={mapLoaded}
                        handleLoaderComplete={this.handleLoaderComplete}
                      />
                    )}

                    <ReactMapGL
                      {...viewport}
                      mapboxApiAccessToken={MAPBOX_TOKEN}
                      mapStyle={MAPBOX_STYLE}
                      onViewportChange={this.onViewportChange}
                      scrollZoom={fullscreenEnabled}
                      // dragPan={dragEnabled}
                      dragRotate={false}
                      doubleClickZoom
                      touchZoom
                      touchRotate={false}
                      // onTransitionStart={() => setTransitionStatus(true)}
                      // onTransitionEnd={() => setTransitionStatus(false)}
                      ref={this.map}
                    >
                      <div className="navigation-control-container">
                        <NavigationControl
                          onViewportChange={(vp) => {
                            const { maxZoom, minZoom, ...viewportNoMaxMin } = vp;

                            return this.onViewportChange(viewportNoMaxMin);
                          }}
                          showCompass={false}
                        />

                        <button onClick={this.handleFullscreenClick}>fullscreen</button>
                      </div>
                    </ReactMapGL>
                  </div>

                  <div className="o-grid-container">
                    <div className="o-grid-row">
                      <div data-o-grid-colspan="12 S11 Scenter M11 L10 XL9">
                        <Histogram geography={activeGeography} speeds={speeds} />
                        <Summary geography={activeGeography} speeds={speeds} />
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            case '<!-- Lead urban/rural histogram here -->':
              return (
                <div className="o-grid-container">
                  <div className="o-grid-row">
                    <div data-o-grid-colspan="12 S11 Scenter M11 L10 XL9">
                      <Histogram speeds={speeds} />
                    </div>
                  </div>
                </div>
              );
            case '<!-- Image grid 1 -->':
              return (
                <ImageGrid images={imageGrid1Images} key="image-grid-1">
                  {({ alt, ...props }) => <img alt={alt} {...props} />}
                </ImageGrid>
              );
            case '<!-- Image grid 2 -->':
              return (
                <ImageGrid images={imageGrid1Images} key="image-grid-2">
                  {({ alt, ...props }) => <img alt={alt} {...props} />}
                </ImageGrid>
              );
            default:
              return (
                <div className="o-grid-container" key={idx}>
                  <div className="o-grid-row">
                    <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
                      {/* eslint-disable-next-line */}
                      <p dangerouslySetInnerHTML={{ __html: el }} />
                    </div>
                  </div>
                </div>
              );
          }
        })}
      </Fragment>
    );
  }
}

export const PropTypeSpeed = PropTypes.shape({
  megabit: PropTypes.number.isRequired,
  postcodes_count: PropTypes.number.isRequired,
  national_pct: PropTypes.number.isRequired,
  EE_rural: PropTypes.number.isRequired,
  EE_urban: PropTypes.number.isRequired,
  EM_rural: PropTypes.number.isRequired,
  EM_urban: PropTypes.number.isRequired,
  London_rural: PropTypes.number.isRequired,
  London_urban: PropTypes.number.isRequired,
  NE_rural: PropTypes.number.isRequired,
  NE_urban: PropTypes.number.isRequired,
  NW_rural: PropTypes.number.isRequired,
  NW_urban: PropTypes.number.isRequired,
  Scotland_rural: PropTypes.number.isRequired,
  Scotland_urban: PropTypes.number.isRequired,
  SE_rural: PropTypes.number.isRequired,
  SE_urban: PropTypes.number.isRequired,
  SW_rural: PropTypes.number.isRequired,
  SW_urban: PropTypes.number.isRequired,
  Wales_rural: PropTypes.number.isRequired,
  Wales_urban: PropTypes.number.isRequired,
  WM_rural: PropTypes.number.isRequired,
  WM_urban: PropTypes.number.isRequired,
  YH_rural: PropTypes.number.isRequired,
  YH_urban: PropTypes.number.isRequired,
});

App.propTypes = {
  activeGeography: PropTypes.shape({
    id: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    postcode: PropTypes.string,
  }),
  speeds: PropTypes.arrayOf(PropTypeSpeed),
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
  geolocatingInProgress: PropTypes.bool.isRequired,
  ukBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  selectedPreset: PropTypes.string.isRequired,
  dragEnabled: PropTypes.bool.isRequired,
  transitionInProgress: PropTypes.bool.isRequired,
  fullscreenEnabled: PropTypes.bool.isRequired,

  // Action dispatchers from Redux
  updateViewport: PropTypes.func.isRequired,
  getPostcodeData: PropTypes.func.isRequired,
  getSpeedData: PropTypes.func.isRequired,
  setMapLoadedStatus: PropTypes.func.isRequired,
  raisePostcodeError: PropTypes.func.isRequired,
  getUserLocation: PropTypes.func.isRequired,
  setDraggableStatus: PropTypes.func.isRequired,
  setTransitionStatus: PropTypes.func.isRequired,
  choosePreset: PropTypes.func.isRequired,
  setFullscreenStatus: PropTypes.func.isRequired,
};

App.defaultProps = {
  activeGeography: {},
  speeds: [],
};

export default connect(state => state, actions)(App);
