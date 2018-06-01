import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';
import './styles.scss';

class ZoomControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controlsHidden: false,
    };
    this.zoomLevels = [props.viewport.minZoom, 6, 9, 12, 15];
  }

  componentDidUpdate() {
    const { minZoom } = this.props.viewport;

    this.zoomLevels[0] = minZoom;
  }

  handleHideClick = () => {
    const { controlsHidden } = this.state;

    this.setState({ controlsHidden: !controlsHidden });
  };

  handleZoomClick = (event) => {
    const zoom = Number(event.target.value);
    const { minZoom, longitude, latitude } = this.props.viewport;

    if (zoom === minZoom) {
      const viewport = new WebMercatorViewport({
        width: window.innerWidth,
        height: window.innerHeight * 0.75,
      });
      const bound = viewport.fitBounds([[-8.655, 49.9], [1.79, 60.85000000000001]], { padding: 0 });

      return this.props.onZoomChange({
        longitude: bound.longitude,
        latitude: bound.latitude,
        zoom: bound.zoom,
      });
    }

    return this.props.onZoomChange({
      longitude,
      latitude,
      zoom,
    });
  };

  render() {
    const { controlsHidden } = this.state;
    const { zoom } = this.props.viewport;
    const { dragEnabled } = this.props;
    const hideButton = (
      <button onClick={this.handleHideClick} className="o-buttons o-buttons--inverse zoom-hide">
        {controlsHidden ? 'Show controls' : 'Hide controls'}
      </button>
    );
    const zoomButtons = this.zoomLevels.map((z, i) => (
      /* eslint-disable jsx-a11y/role-supports-aria-props */
      <button
        key={z}
        value={z}
        onClick={this.handleZoomClick}
        className={`o-buttons o-buttons--inverse zoom-${i === 0 ? 'reset' : z} ${
          controlsHidden ? 'hidden' : ''
        }`}
        aria-selected={z.toFixed(5) === zoom.toFixed(5) ? 'true' : 'false'}
      >
        {i === 0 ? 'Reset zoom' : `${z}x`}
      </button>
      /* eslint-enable jsx-a11y/role-supports-aria-props */
    ));

    return (
      <div>
        <div className="drag-indicator-container">
          <div>Drag enabled: </div>

          <div className={`drag-indicator${dragEnabled ? ' enabled' : ''}`} />
        </div>

        <div className="o-buttons__group zoom-control-container">
          {hideButton}
          {zoomButtons}
        </div>
      </div>
    );
  }
}

ZoomControls.propTypes = {
  viewport: PropTypes.object.isRequired, // eslint-disable-line
  onZoomChange: PropTypes.func.isRequired,
  dragEnabled: PropTypes.bool.isRequired,
};

ZoomControls.defaultProps = { minZoom: 0 };

export default ZoomControls;
