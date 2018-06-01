/**
 * @file
 * Main app component
 */

import React, { Component, Fragment } from 'react';
import ReactMapGL, { NavigationControl, FlyToInterpolator } from 'react-map-gl';
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
import GeolocateMe from './geolocate-me';
import ImageGrid from './image-grid';
import './styles.scss';

const MAPBOX_STYLE = 'mapbox://styles/financialtimes/cjg290kic7od82rn46o3o719e';
const MAPBOX_TOKEN = window.mapboxToken;

// @TODO replace
const imageGrid1Images = require('./image-grid/placeholders.json');

class App extends Component {
  constructor(props) {
    super(props);

    const viewport = new WebMercatorViewport({
      width: props.viewport.width,
      height: props.viewport.height,
    });
    const bound = viewport.fitBounds(props.ukBounds, { padding: 20 });

    props.updateViewport({
      ...props.viewport,
      ...bound,
      minZoom: bound.zoom,
    });

    this.state = {
      loaderComplete: false, // loaderComplete kept as part of state b/c impl. deet
      dragEnabled: false,
    };

    this.map = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
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
    const dragEnabled = viewport.zoom !== this.props.viewport.minZoom;

    this.props.updateViewport({ ...this.props.viewport, ...viewport });
    this.setState({ dragEnabled });
  };

  resize = () => {
    console.log('Viewport will resize…');

    this.onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight * 0.6,
    });
  };

  initialiseMap = () => {
    const map = this.map.current.getMap();

    console.log('Loading map resources…');

    map.on('load', () => {
      // const layers = map.getStyle().layers;
      // const firstLineLayerId = layers.find(l => l.type === 'line').id;
      //
      // console.log('Map resources loaded. Adding GeoTIFF layer…');
      //
      // map.addLayer(
      //   {
      //     id: 'geotiff-layer',
      //     type: 'raster',
      //     source: {
      //       type: 'raster',
      //       tiles: [
      //         `https://a.tiles.mapbox.com/v4/financialtimes.882qjlo5/{z}/{x}/{y}@2x.png?access_token=${MAPBOX_TOKEN}`,
      //       ],
      //     },
      //     minzoom: 0,
      //     maxzoom: 12,
      //   },
      //   firstLineLayerId,
      // );

      console.log('Map resources loaded');

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
    const {
      activeGeography,
      geolocatingInProgress,
      getPostcodeData,
      getUserLocation,
      mapLoaded,
      raisePostcodeError,
      speeds,
      viewport,
    } = this.props;

    return (
      <Fragment>
        {window.PRELOADED_COPY.map((el) => {
          switch (el) {
            case '<!-- Postcode input, Mapbox map and dynamic histogram -->':
              return (
                <Fragment>
                  <div className="o-grid-container">
                    <div className="o-grid-row">
                      <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7" className="locate-user">
                        <GeographyLookup
                          goToViewport={this.goToViewport}
                          raisePostcodeError={raisePostcodeError}
                          getPostcodeData={getPostcodeData}
                        />
                        <GeolocateMe
                          getUserLocation={getUserLocation}
                          geolocatingInProgress={geolocatingInProgress}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="map-container">
                    {this.state.loaderComplete ? null : (
                      <Loader
                        mapLoaded={mapLoaded}
                        handleLoaderComplete={this.handleLoaderComplete}
                      />
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
                      <div data-o-grid-colspan="12 S11 Scenter M11 L10 XL9">
                        <Histogram geography={activeGeography} speeds={speeds} />
                        <Summary geography={activeGeography} speeds={speeds} />
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            case '<!-- Lead urban/rural histogram here -->':
            case '<!-- Image grid 1 -->':
              return (
                <ImageGrid images={imageGrid1Images}>
                  {({ url, title, alt }) => <img src={url} alt={alt} title={title} />}
                </ImageGrid>
              );
            case '<!-- Image grid 2 -->':
              return (
                <ImageGrid images={imageGrid1Images}>
                  {({ url, title, alt }) => <img src={url} alt={alt} title={title} />}
                </ImageGrid>
              );
            default:
              return (
                <div className="o-grid-container">
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

App.propTypes = {
  activeGeography: PropTypes.shape({
    id: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    postcode: PropTypes.string,
  }),
  speeds: PropTypes.array /* @TODO improve PropType */, // eslint-disable-line
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

  // Action dispatchers from Redux
  updateViewport: PropTypes.func.isRequired,
  getPostcodeData: PropTypes.func.isRequired,
  getSpeedData: PropTypes.func.isRequired,
  setMapLoadedStatus: PropTypes.func.isRequired,
  raisePostcodeError: PropTypes.func.isRequired,
  getUserLocation: PropTypes.func.isRequired,
};

App.defaultProps = {
  activeGeography: {},
  speeds: [],
};

export default connect(state => state, actions)(App);
