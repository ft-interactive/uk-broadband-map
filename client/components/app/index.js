import React, { Component } from 'react';
import ReactMapGL, { NavigationControl, FlyToInterpolator } from 'react-map-gl';
import * as d3 from 'd3-ease'; // eslint-disable-line
import GeographyLookup from './geography-lookup';
import './styles.scss';

const MAPBOX_STYLE = 'mapbox://styles/financialtimes/cjg290kic7od82rn46o3o719e';
const MAPBOX_TOKEN = window.mapboxToken;

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
    };
    this.resize = this.resize.bind(this);
    this.goToViewport = this.goToViewport.bind(this);
    this.handleChange = this.handleGeographyChange.bind(this);
    this.handleGeographySubmit = this.handleGeographySubmit.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);

    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
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

  goToViewport() {
    const nextLocation = { longitude: -0.070691, latitude: 51.4594016, zoom: 10 };
    const { longitude, latitude, zoom } = nextLocation;

    this.onViewportChange({
      longitude,
      latitude,
      zoom,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    });
  }

  handleGeographyChange(geography) {
    console.log(`Typing: ${geography}…`);
  }

  handleGeographySubmit(geography) {
    console.log(`Submitted: ${geography}`);

    this.setState({ activeGeography: geography });
  }

  render() {
    return (
      <div>
        <button onClick={this.goToViewport}>Start transition</button>

        <GeographyLookup
          onGeographyChange={this.handleGeographyChange}
          onGeographySubmit={this.handleGeographySubmit}
        />

        <ReactMapGL
          {...this.state.viewport}
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

export default App;
