import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GeographyLookup extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.textInput = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.getPostcodeData(this.textInput.current.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="geography">
          Enter postcode:
          <input type="text" onChange={this.handleChange} ref={this.textInput} id="geography" />
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}

GeographyLookup.propTypes = {
  getPostcodeData: PropTypes.func.isRequired,
};

export default GeographyLookup;
