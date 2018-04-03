import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
const MAPBOX_TOKEN = window.mapboxToken;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        maxZoom: 16,
      },
    };
    this.resize = this.resize.bind(this);
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

  render() {
    return (
      <div>
        <ReactMapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange={viewport => this.onViewportChange(viewport)}
          scrollZoom={false}
          dragPan={false}
          dragRotate={false}
          doubleClickZoom={false}
          touchZoom={false}
        />
      </div>
    );
  }
}

export default App;
