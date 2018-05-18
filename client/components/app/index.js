import React, { Component } from 'react';
import ReactMapGL, { NavigationControl, LinearInterpolator } from 'react-map-gl';
import * as d3 from 'd3-ease'; // eslint-disable-line
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../../state/actions';
import GeographyLookup from './geography-lookup';
import Histogram from './histogram';
import './styles.scss';

const MAPBOX_STYLE = 'mapbox://styles/financialtimes/cjg290kic7od82rn46o3o719e';
const MAPBOX_TOKEN = window.mapboxToken;

class App extends Component {
  constructor(props) {
    super(props);

    this.onViewportChange = this.onViewportChange.bind(this);
    this.resize = this.resize.bind(this);
    this.handleGeographyChange = this.handleGeographyChange.bind(this);
    this.goToViewport = this.goToViewport.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);

    this.resize();
  }

  componentDidUpdate() {
    const { id, longitude, latitude } = this.props.activeGeography;
    if (id && longitude && latitude) this.goToViewport({ longitude, latitude }, id);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onViewportChange(viewport) {
    this.props.updateViewport({ ...this.props.viewport, ...viewport });
  }

  resize() {
    console.log('Viewport will resize...');

    this.onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  goToViewport({ longitude, latitude }) {
    const zoom = this.props.viewport.maxZoom;

    this.onViewportChange({
      longitude,
      latitude,
      zoom,
      transitionDuration: 5000,
      transitionInterpolator: new LinearInterpolator(),
      transitionEasing: d3.easeCubic,
    });
  }

  render() {
    return (
      <div>
        <GeographyLookup
          goToViewport={this.goToViewport}
          getPostcodeData={this.props.getPostcodeData}
        />

        <Histogram geography={this.props.activeGeography} />

        <ReactMapGL
          {...this.props.viewport}
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange={viewport => this.onViewportChange(viewport)}
          scrollZoom={false}
          dragRotate={false}
          doubleClickZoom={false}
          touchZoom={false}
        >
          <div className="navigation-control-container">
            <NavigationControl
              onViewportChange={(viewport) => {
                const { maxZoom, minZoom, ...viewportNoMaxMin } = viewport;

                return this.onViewportChange(viewportNoMaxMin);
              }}
            />
          </div>
        </ReactMapGL>
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
  viewport: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    zoom: PropTypes.number,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
  }).isRequired,

  // Action dispatchers from Redux
  updateViewport: PropTypes.func.isRequired,
  getPostcodeData: PropTypes.func.isRequired,
};

App.defaultProps = {
  activeGeography: {},
};

export default connect(state => state, actions)(App);
