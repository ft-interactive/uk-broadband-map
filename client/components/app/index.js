import React, { Component } from 'react';
import ReactMapGL, { NavigationControl } from 'react-map-gl';
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
    );
  }
}

export default App;
