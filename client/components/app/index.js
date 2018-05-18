import React, { Component } from 'react';
import ReactMapGL, { NavigationControl, LinearInterpolator } from 'react-map-gl';
import * as d3 from 'd3-ease'; // eslint-disable-line
import GeographyLookup from './geography-lookup';
import Histogram from './histogram';
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
      activeGeography: null,
    };
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

  async handleGeographySubmit(input) {
    const postcode = input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    try {
      const location = 'http://ft-ig-content-prod.s3-website-eu-west-1.amazonaws.com/v2/ft-interactive/uk-broadband-map/master';
      const request = await fetch(`${location}/postcode/${postcode}.json`);
      const geography = await request.json();
      const coordinates = {
        longitude: Number(geography.longitude),
        latitude: Number(geography.latitude),
      };
      this.goToViewport(coordinates, geography);
      this.setState({ error: null });
    } catch (e) {
      this.setState({
        error: 'Could not find that postcode!',
        activeGeography: null,
      });
    }
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
        {this.state.error ? <span>{this.state.error}</span> : null}
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
