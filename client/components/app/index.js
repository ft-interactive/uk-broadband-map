import React, { Component } from 'react';
import ReactMapGL, { NavigationControl, LinearInterpolator } from 'react-map-gl';
import * as d3 from 'd3-ease'; // eslint-disable-line
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

    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -2.5,
        latitude: 54.5,
        zoom: 5,
        maxZoom: 10,
        minZoom: 5,
      },
      activeGeography: null,
    };
    this.setZoom = this.setZoom.bind(this);
    this.onViewportChange = this.onViewportChange.bind(this);
    this.resize = this.resize.bind(this);
    this.handleGeographyChange = this.handleGeographyChange.bind(this);
    this.handleGeographySubmit = this.handleGeographySubmit.bind(this);
    this.goToViewport = this.goToViewport.bind(this);
    this.map = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);

    this.resize();
    this.setZoom();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  setZoom() {
    const map = this.map.current.getMap();

    console.log(map);
  }

  onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
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

  goToViewport({ longitude, latitude }, activeGeography) {
    const zoom = this.state.viewport.maxZoom;

    this.onViewportChange({
      longitude,
      latitude,
      zoom,
      transitionDuration: 5000,
      transitionInterpolator: new LinearInterpolator(),
      transitionEasing: d3.easeCubic,
    });

    this.setState({ activeGeography });
  }

  render() {
    return (
      <div>
        <GeographyLookup
          onGeographyChange={this.handleGeographyChange}
          onGeographySubmit={this.handleGeographySubmit}
        />

        <Histogram geography={this.state.activeGeography} />

        <ReactMapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange={viewport => this.onViewportChange(viewport)}
          scrollZoom={false}
          dragRotate={false}
          doubleClickZoom={false}
          touchZoom={false}
          ref={this.map}
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

export default App;
