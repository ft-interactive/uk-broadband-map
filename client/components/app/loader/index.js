import React, { Component } from 'react';
import './styles.scss';

class Loader extends Component {
  constructor(props) {
    super(props);

    this.loader = React.createRef();
  }

  componentDidMount() {
    this.loader.current.addEventListener('transitionend', () => {
      this.props.onTransitionEnd();
    }, false);
  }

  render() {
    const { mapLoaded } = this.props;

    return (
      <div
        className={`loader ${mapLoaded ? 'map-loaded' : ''}`}
        ref={this.loader}
      >
        <p>Loading…</p>
      </div>
    );
  }
}

export default Loader;
