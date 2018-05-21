import React, { Component } from 'react';
import ReactMapGL, { NavigationControl, LinearInterpolator } from 'react-map-gl';
import * as d3 from 'd3-ease'; // eslint-disable-line
import WebMercatorViewport from 'viewport-mercator-project';
import GeographyLookup from './geography-lookup';
import Histogram from './histogram';
import Loader from './loader';
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

    const viewport = new WebMercatorViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const bound = viewport.fitBounds(
      [[-7.57216793459, 49.959999905], [1.68153079591, 58.6350001085]],
      { padding: 20 },
    );

    this.state = {
      viewport: {
        ...bound,
        minZoom: bound.zoom,
        maxZoom: 14,
      },
      activeGeography: null,
      mapLoaded: false,
      loaderComplete: false,
    };
    this.onViewportChange = this.onViewportChange.bind(this);
    this.resize = this.resize.bind(this);
    this.initialiseMap = this.initialiseMap.bind(this);
    this.handleGeographyChange = this.handleGeographyChange.bind(this);
    this.handleGeographySubmit = this.handleGeographySubmit.bind(this);
    this.goToViewport = this.goToViewport.bind(this);
    this.handleLoaderComplete = this.handleLoaderComplete.bind(this);
    this.map = React.createRef();
    this.loader = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);

    this.initialiseMap();
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
    console.log('Viewport will resize…');

    this.onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  initialiseMap() {
    const map = this.map.current.getMap();

    console.log('Loading map resources…');

    map.on('load', () => {
      const layers = map.getStyle().layers;
      const firstLineLayerId = layers.find(l => l.type === 'line').id;

      console.log('Map resources loaded. Adding GeoTIFF layer…');

      map.addLayer({
        id: 'geotiff-layer',
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [`https://a.tiles.mapbox.com/v4/financialtimes.882qjlo5/{z}/{x}/{y}@2x.png?access_token=${MAPBOX_TOKEN}`],
        },
        minzoom: 0,
        maxzoom: 12,
      }, firstLineLayerId);

      this.setState({ mapLoaded: true });
    });
  }

  handleGeographyChange(str) { // eslint-disable-line
    console.log(`Typing: ${str}…`);
  }

  handleGeographySubmit(str) {
    const geography = dummyData.find(d => d.id.toLowerCase() === str.toLowerCase());
    const { id, longitude, latitude } = geography;

    console.log(`Submitted: ${id}`);

    this.goToViewport({ longitude, latitude }, id);
  }

  goToViewport({ longitude, latitude }, activeGeography) {
    const { zoom } = this.state.viewport;

    this.onViewportChange({
      longitude,
      latitude,
      zoom: zoom * 2,
      transitionDuration: 5000,
      transitionInterpolator: new LinearInterpolator(),
      transitionEasing: d3.easeCubic,
    });

    this.setState({ activeGeography });
  }

  handleLoaderComplete() {
    console.log('Loader opacity transition complete. Unmounting Loader…');

    this.setState({ loaderComplete: true });
  }

  render() {
    const { viewport, activeGeography, mapLoaded, loaderComplete } = this.state;
    const loader = loaderComplete ? null : (
      <Loader
        mapLoaded={mapLoaded}
        onTransitionEnd={this.handleLoaderComplete}
        ref={this.loader}
      />
    );

    return (
      <div>
        <GeographyLookup
          onGeographyChange={this.handleGeographyChange}
          onGeographySubmit={this.handleGeographySubmit}
        />

        <Histogram geography={activeGeography} />

        <div className="map-container">
          {loader}

          <ReactMapGL
            {...viewport}
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
      </div>
    );
  }
}

export default App;
