import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

class ZoomControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dragEnabled: false,
      controlsHidden: false,
    };
    this.zoomLevels = [props.minZoom, 6, 9, 12, 15];
  }

  componentDidUpdate() {
    const { minZoom } = this.props;

    this.zoomLevels[0] = minZoom;
  }

  handleHideClick = () => {
    const { controlsHidden } = this.state;

    this.setState({ controlsHidden: !controlsHidden });
  };

  handleZoomClick = (event) => {
    const viewport = { zoom: Number(event.target.value) };

    this.props.onZoomChange(viewport);
  };

  render() {
    const { controlsHidden } = this.state;
    const { zoom, dragEnabled } = this.props;
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
        aria-selected={z === zoom ? 'true' : 'false'}
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
  zoom: PropTypes.number.isRequired,
  minZoom: PropTypes.number,
  onZoomChange: PropTypes.func.isRequired,
  dragEnabled: PropTypes.bool.isRequired,
};

ZoomControls.defaultProps = { minZoom: 0 };

export default ZoomControls;
