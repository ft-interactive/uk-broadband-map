/**
 * @file
 * Main map component
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMapGL, { FlyToInterpolator, NavigationControl, Marker } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import { throttle } from 'lodash';
import mapboxgl from 'mapbox-gl';
import { Icon } from 'react-icons-kit';
import { location2 } from 'react-icons-kit/icomoon/location2';
import { easeCubic } from 'd3-ease';
import BoundedGeolocateControl from '../bounded-geolocate';
import HistogramContainer from '../histogram-container';
import GeographyLookup from '../geography-lookup';
import Loader from '../loader';
import LocationsDropdown from '../locations-dropdown';
import FullscreenControl from '../fullscreen-control';
import { propTypeActiveGeography, propTypeViewport } from '../../../helpers/proptypes';
import * as actions from '../../../state/actions';
import { INITIAL_STATE } from '../../../state/reducers';
import './styles.scss';

const MAPBOX_STYLE = 'mapbox://styles/financialtimes/cjidbu7fo0w0a2ssbyxtfb587';
const MAPBOX_TOKEN = window.mapboxToken;
const presets = require('../locations-dropdown/locations.json');

class Map extends Component {
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
    const [bottomRight, topLeft] = this.props.ukBounds;
    const [minLon, minLat] = bottomRight;
    const [maxLon, maxLat] = topLeft;

    /* eslint-disable no-param-reassign */
    if (viewport.longitude > maxLon) {
      viewport.longitude = maxLon;
    }
    if (viewport.longitude < minLon) {
      viewport.longitude = minLon;
    }
    if (viewport.latitude > maxLat) {
      viewport.latitude = maxLat;
    }
    if (viewport.latitude < minLat) {
      viewport.latitude = minLat;
    }
    /* eslint-enable */

    this.props.updateViewport({ ...this.props.viewport, ...viewport });
  };

  mapContainer = React.createRef();
  map = React.createRef();

  resize = () => {
    console.log('Viewport will resize…');

    const width = this.mapContainer.current.clientWidth;
    const height = this.mapContainer.current.clientHeight;
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
    const scale = new mapboxgl.ScaleControl();
    const geolocation = new BoundedGeolocateControl({
      maxZoom: 12,
    });

    geolocation.on('error', (e) => {
      if (e.message === 'Outside UK Bounds') {
        this.props.raiseGeolocationError(e);
      }
    });

    geolocation.on('geolocate', (position) => {
      this.props.clearGeolocationError();
      this.props.getUserLocation(position.coords);
    });

    console.log('Loading map resources…');

    map.on('load', () => {
      console.log('Map resources loaded.');

      map.addControl(geolocation);
      map.addControl(scale);

      this.props.setMapLoadedStatus(true);
    });
  };

  goToViewport = ({
    longitude = this.props.viewport.longitude,
    latitude = this.props.viewport.latitude,
    zoom,
  }) => {
    const { zoom: currentZoom } = this.props.viewport;
    const transitionDuration =
      Math.abs((zoom - currentZoom) * 500) || INITIAL_STATE.viewport.transitionDuration;

    console.log(`Transition duration: ${transitionDuration}`);

    this.onViewportChange({
      longitude,
      latitude,
      zoom,
      transitionDuration,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: easeCubic,
    });
  };

  render() {
    const {
      // State
      activeGeography,
      geolocatingInProgress,
      mapLoaded,
      viewport,
      selectedPreset,
      transitionInProgress,
      postcodeError,
      fullscreenEnabled,
      // dragEnabled,

      // Actions
      getPostcodeData,
      getUserLocation,
      raisePostcodeError,
      choosePreset,
      setTransitionStatus,
      setFullscreenStatus,
      updatePostcodeInputValue,
      postcodeInputValue,
    } = this.props;
    return (
      <Fragment>
        <div className="o-grid-container">
          <div className="o-grid-row">
            <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
              <h2>Compare your broadband speed to your region and the rest of Britain</h2>
            </div>
          </div>

          <div className="o-grid-row">
            <div className="locate-user" data-o-grid-colspan="12 S11 Scenter M11 L10 XL9">
              <GeographyLookup
                goToViewport={this.goToViewport}
                raisePostcodeError={raisePostcodeError}
                getPostcodeData={getPostcodeData}
                getUserLocation={getUserLocation}
                geolocatingInProgress={geolocatingInProgress}
                postcodeError={postcodeError}
                onChange={updatePostcodeInputValue}
                value={postcodeInputValue}
              />
              <span>OR</span>
              <LocationsDropdown
                presets={presets}
                selectedPreset={selectedPreset}
                choosePreset={choosePreset}
              />
            </div>
          </div>

          <div className="o-grid-row">
            <div className="interactive-wrapper" data-o-grid-colspan="12">
              <div className="map-container" ref={this.mapContainer}>
                {this.props.doneLoading || (
                  <Loader mapLoaded={mapLoaded} handleLoaderComplete={this.props.loadingComplete} />
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
                  onTransitionStart={() => {
                    setTransitionStatus(true);
                  }}
                  onTransitionEnd={() => {
                    setTransitionStatus(false);
                  }}
                  ref={this.map}
                >
                  {activeGeography.latitude &&
                    activeGeography.longitude &&
                    !transitionInProgress && (
                    <div style={{ color: 'white' }}>
                      <Marker
                        latitude={activeGeography.latitude}
                        longitude={activeGeography.longitude}
                        offsetTop={-16}
                        offsetLeft={-8}
                      >
                        <Icon icon={location2} size={32} />
                      </Marker>
                    </div>
                  )}
                  <div className="navigation-control-container">
                    <NavigationControl
                      onViewportChange={({ maxZoom, minZoom, ...rest }) =>
                        this.onViewportChange(rest)
                      }
                      showCompass={false}
                    />

                    {this.mapContainer &&
                      this.mapContainer.current && (
                      <FullscreenControl
                        targetElement={this.mapContainer.current}
                        onFullscreenChange={setFullscreenStatus}
                        onResize={this.resize}
                        fullscreenStatus={fullscreenEnabled}
                      />
                    )}
                  </div>
                </ReactMapGL>
              </div>

              <HistogramContainer />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

Map.propTypes = {
  // Props from state
  activeGeography: propTypeActiveGeography,
  viewport: propTypeViewport.isRequired,
  mapLoaded: PropTypes.bool.isRequired,
  geolocatingInProgress: PropTypes.bool.isRequired,
  ukBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  selectedPreset: PropTypes.string.isRequired,
  dragEnabled: PropTypes.bool.isRequired,
  transitionInProgress: PropTypes.bool.isRequired,
  postcodeError: PropTypes.string.isRequired,
  controlsHidden: PropTypes.bool.isRequired,
  fullscreenEnabled: PropTypes.bool.isRequired,
  doneLoading: PropTypes.bool.isRequired,
  postcodeInputValue: PropTypes.string.isRequired,

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
  raiseGeolocationError: PropTypes.func.isRequired,
  clearGeolocationError: PropTypes.func.isRequired,
  setFullscreenStatus: PropTypes.func.isRequired,
  loadingComplete: PropTypes.func.isRequired,
  updatePostcodeInputValue: PropTypes.func.isRequired,
  clearSelectedPreset: PropTypes.func.isRequired,
  clearPostcodeInputValue: PropTypes.func.isRequired,
};

Map.defaultProps = {
  activeGeography: [],
  postcodeInputValue: '',
};

export default connect(state => state, actions)(Map);
