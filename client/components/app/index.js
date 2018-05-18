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
const dummyData = [
  {
    id: 'PO4 0LZ',
    latitude: 50.790111,
    longitude: -1.074687,
  },
  {
    id: 'TF5 0DR',
    latitude: 52.718158,
    longitude: -2.543583,
  },
  {
    id: 'RG25 2NP',
    latitude: 51.240123,
    longitude: -1.09689,
  },
];

class App extends Component {
  constructor(props) {
    super(props);

    this.onViewportChange = this.onViewportChange.bind(this);
    this.resize = this.resize.bind(this);
    this.handleGeographyChange = this.handleGeographyChange.bind(this);
    this.handleGeographySubmit = this.handleGeographySubmit.bind(this);
    this.goToViewport = this.goToViewport.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);

    this.resize();
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

  handleGeographyChange(str) {
    console.log(`Typing: ${str}…`);
  }

  handleGeographySubmit(str) {
    const geography = dummyData.find(d => d.id.toLowerCase() === str.toLowerCase());
    const { id, longitude, latitude } = geography;

    console.log(`Submitted: ${id}`);

    this.goToViewport({ longitude, latitude }, id);
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
        <GeographyLookup getPostcodeData={this.props.getPostcodeData} />

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
