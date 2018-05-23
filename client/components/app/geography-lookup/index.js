import React, { Component } from 'react';
import PropTypes from 'prop-types';

const postcodeRegex = /^([Gg][Ii][Rr] ?0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) ?[0-9][A-Za-z]{2})$/i;

class GeographyLookup extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const postcode = this.textInput.current.value;
    try {
      if (!postcodeRegex.test(postcode)) {
        throw new Error(`Postcode ${postcode} is invalid`);
      } else if (
        postcode
          .toLowerCase()
          .replace(/\s/g, '')
          .startsWith('bt')
      ) {
        throw new Error(`Postcode ${postcode} is in Northern Ireland`);
      }

      this.props.getPostcodeData(postcode);
    } catch (e) {
      this.props.raisePostcodeError(e);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="geography">
          Enter postcode:
          <input type="text" ref={this.textInput} id="geography" />
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}

GeographyLookup.propTypes = {
  getPostcodeData: PropTypes.func.isRequired,
  raisePostcodeError: PropTypes.func.isRequired,
};

export default GeographyLookup;
