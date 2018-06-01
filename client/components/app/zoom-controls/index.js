import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';
import './styles.scss';

// TODO: figure out how to set this without using state
const controlsHidden = false;

class ZoomControls extends PureComponent {
  handleZoomClick = (event) => {
    console.log(event.target.value);
    const zoom = Number(event.target.value);
    const { longitude, latitude, minZoom } = this.props.viewport;

    if (zoom.toFixed(5) === minZoom.toFixed(5)) {
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

  renderZoomButton = (num) => {
    const { zoomLevels } = this.props;
    const { zoom: currentZoomLevel } = this.props.viewport;
    const currentZoomIndex = zoomLevels.indexOf(currentZoomLevel);
    let value;

    if (currentZoomIndex > -1) {
      value = num > -1 ? zoomLevels[currentZoomIndex - 1] : zoomLevels[currentZoomIndex + 1];
    } else {
      value = 'HURRRRR';
    }

    return (
      <button
        value={value}
        onClick={this.handleZoomClick}
        className={`o-buttons o-buttons--inverse zoom-plus ${controlsHidden ? 'hidden' : ''}`}
      >
        {value}
      </button>
    );
  };

  render() {
    const { dragEnabled } = this.props;

    return (
      <div>
        <div className="drag-indicator-container">
          <div>Drag enabled: </div>

          <div className={`drag-indicator${dragEnabled ? ' enabled' : ''}`} />
        </div>

        <div className="o-buttons__group zoom-control-container">
          {[1, -1].map(x => this.renderZoomButton(x))}
        </div>
      </div>
    );
  }
}

ZoomControls.propTypes = {
  viewport: PropTypes.object.isRequired, // eslint-disable-line
  zoomLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
  onZoomChange: PropTypes.func.isRequired,
  dragEnabled: PropTypes.bool.isRequired,
};

ZoomControls.defaultProps = { minZoom: 0 };

export default ZoomControls;
