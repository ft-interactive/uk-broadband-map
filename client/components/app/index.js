/**
 * @file
 * Main app component
 */

import React, { Component } from 'react';
import ReactMapGL, { NavigationControl, FlyToInterpolator } from 'react-map-gl';
import * as d3 from 'd3-ease'; // eslint-disable-line
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';
import * as actions from '../../state/actions';
import GeographyLookup from './geography-lookup';
import Histogram from './histogram';
import Loader from './loader';
import './styles.scss';

const MAPBOX_STYLE = 'mapbox://styles/financialtimes/cjg290kic7od82rn46o3o719e';
const MAPBOX_TOKEN = window.mapboxToken;

class App extends Component {
  constructor(props) {
    super(props);

    const viewport = new WebMercatorViewport({
      width: props.viewport.width,
      height: props.viewport.height,
    });

    const bound = viewport.fitBounds(
      [[-7.57216793459, 49.959999905], [1.68153079591, 58.6350001085]],
      { padding: 20 },
    );

    props.updateViewport({
      ...props.viewport,
      ...bound,
      minZoom: bound.zoom,
    });

    this.state = {
      loaderComplete: false, // loaderComplete kept as part of state b/c impl. deet
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

    if (longitude !== oldLong && latitude !== oldLat) {
      this.goToViewport({ longitude, latitude });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onViewportChange = (viewport) => {
    this.props.updateViewport({ ...this.props.viewport, ...viewport });
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

  goToViewport = ({ longitude, latitude }) => {
    const { maxZoom: zoom } = this.props.viewport;

    this.onViewportChange({
      longitude,
      latitude,
      zoom,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    });
  };

  handleLoaderComplete = () => {
    console.log('Loader opacity transition complete. Unmounting Loader…');
    this.setState({ loaderComplete: true });
  };

  render() {
    const { viewport, activeGeography, mapLoaded } = this.props;

    return (
      <div>
        <div className="o-grid-container">
          <div className="o-grid-row">
            <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
              <GeographyLookup
                goToViewport={this.goToViewport}
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
            dragRotate={false}
            doubleClickZoom={false}
            touchZoom={false}
            ref={this.map}
          >
            <div className="navigation-control-container">
              <NavigationControl
                onViewportChange={(vp) => {
                  const { maxZoom, minZoom, ...viewportNoMaxMin } = vp;

                  return this.onViewportChange(viewportNoMaxMin);
                }}
              />
            </div>
          </ReactMapGL>
        </div>

        <div className="o-grid-container">
          <div className="o-grid-row">
            <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
              <Histogram geography={activeGeography} speeds={this.props.speeds} />
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
};

App.defaultProps = {
  activeGeography: {},
  speeds: [],
};

export default connect(state => state, actions)(App);
