/**
 * @file
 * Main map component
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMapGL, { FlyToInterpolator, NavigationControl } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import { throttle } from 'lodash';
import mapboxgl from 'mapbox-gl';
import { easeCubic } from 'd3-ease';
import BoundedGeolocateControl from '../bounded-geolocate';
import HistogramContainer from '../histogram-container';
import GeographyLookup from '../geography-lookup';
import Loader from '../loader';
import LocationsDropdown from '../locations-dropdown';
import FullscreenControl from '../fullscreen-control';
import {
  propTypeActiveGeography,
  propTypeViewport,
  propTypeSpeed,
} from '../../../helpers/proptypes';
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
    this.bins = this.props.speeds.filter(d => d.megabit <= 150);

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
    const { zoom, maxZoom, minZoom } = viewport;
    const zoomInButton = document.getElementsByClassName('mapboxgl-ctrl-zoom-in')[0];
    const zoomOutButton = document.getElementsByClassName('mapboxgl-ctrl-zoom-out')[0];
    const disableZoomIn = Math.ceil(zoom) >= maxZoom;
    const disableZoomOut = Math.floor(zoom) <= minZoom;

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

    zoomInButton.disabled = disableZoomIn;
    zoomOutButton.disabled = disableZoomOut;

    this.props.updateViewport({ ...this.props.viewport, ...viewport });
  };

  mapContainer = React.createRef();
  map = React.createRef();

  resize = () => {
    console.log('Viewport will resize…');

    const width = this.mapContainer.current.getBoundingClientRect().width;
    const height = this.mapContainer.current.getBoundingClientRect().height;
    const viewport = new WebMercatorViewport({ width, height });
    const { zoom, minZoom } = this.props.viewport;
    const bound = viewport.fitBounds(this.props.ukBounds, { padding: 10 });

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
      fitBoundsOptions: {
        maxZoom: 12,
      },
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

    map.addControl(geolocation);
    map.addControl(scale);

    console.log('Loading map resources…');

    map.once('load', () => {
      console.log('Map resources loaded.');
      this.props.setMapLoadedStatus(true);

      try {
        geolocation.trigger();
      } catch (e) {
        console.error(e);
      }
    });
  };

  goToViewport = ({
    longitude = this.props.viewport.longitude,
    latitude = this.props.viewport.latitude,
    zoom,
  }) => {
    const transitionDuration = INITIAL_STATE.viewport.transitionDuration;

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
      geolocatingInProgress,
      mapLoaded,
      viewport,
      selectedPreset,
      postcodeError,
      fullscreenEnabled,
      // dragEnabled,

      // Actions
      getPostcodeData,
      getUserLocation,
      raisePostcodeError,
      choosePreset,
      setFullscreenStatus,
      updatePostcodeInputValue,
      postcodeInputValue,
    } = this.props;

    const fullscreenCapable = document.documentElement.classList.contains('fullscreen');

    return (
      <Fragment>
        <div className="o-grid-container o-grid-container__graphic">
          <div className="o-grid-row">
            <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
              <h2 className="graphic__title" style={{ maxWidth: '17em' }}>
                Compare broadband speeds in your area to your region and the rest of Britain
              </h2>
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
                  maxTileCacheSize={/ipad/i.test(navigator.userAgent) ? 2 : null}
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  mapStyle={MAPBOX_STYLE}
                  onViewportChange={this.onViewportChange}
                  scrollZoom={fullscreenEnabled}
                  // dragPan={dragEnabled}
                  dragRotate={false}
                  doubleClickZoom
                  touchZoom
                  touchRotate={false}
                  touchAction="pan-y"
                  // onTransitionStart={() => {
                  //   setTransitionStatus(true);
                  // }}
                  // onTransitionEnd={() => {
                  //   setTransitionStatus(false);
                  // }}
                  ref={this.map}
                >
                  <div className="navigation-control-container">
                    <NavigationControl
                      onViewportChange={({ maxZoom, minZoom, ...rest }) =>
                        this.onViewportChange(rest)
                      }
                      showCompass={false}
                    />

                    {this.mapContainer &&
                      this.mapContainer.current &&
                      fullscreenCapable && (
                      <FullscreenControl
                        targetElement={this.mapContainer.current}
                        onFullscreenChange={setFullscreenStatus}
                        onResize={this.resize}
                        fullscreenStatus={fullscreenEnabled}
                      />
                    )}
                  </div>
                </ReactMapGL>
                <figcaption className="map__source">
                  Source: FT analysis of Ofcom data (May 2017)<br />&copy; FT
                </figcaption>
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
  speeds: PropTypes.arrayOf(propTypeSpeed),

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
  speeds: [],
};

export default connect(state => state, actions)(Map);
