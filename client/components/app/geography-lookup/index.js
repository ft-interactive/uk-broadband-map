import React, { Component } from 'react';

class GeographyLookup extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.props.onGeographyChange(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.onGeographySubmit(this.input.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="geography">
          Enter postcode:
          <input
            type="text"
            onChange={this.handleChange}
            ref={(input) => { this.input = input; }}
            id="geography"
          />
        </label>

        <input
          type="submit"
          value="Submit"
        />
      </form>
    );
  }
}

export default GeographyLookup;
