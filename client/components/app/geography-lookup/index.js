import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-icons-kit';
import { search } from 'react-icons-kit/icomoon/search';
import GeolocateMe from '../geolocate-me';

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
      <form className="locate-user__form" onSubmit={this.handleSubmit}>
        <div className="locate-user__affix-wrapper">
          <input
            type="text"
            placeholder="Enter your postcode to search your area..."
            ref={this.textInput}
            id="geography"
            className="locate-user__text"
          />
          <div className="locate-user__suffix">
            <button type="button" className="locate-user__button">
              <Icon className="geolocate" icon={search} />
            </button>
            <GeolocateMe
              getUserLocation={this.props.getUserLocation}
              geolocatingInProgress={this.props.geolocatingInProgress}
            />
          </div>
        </div>
      </form>
    );
  }
}

GeographyLookup.propTypes = {
  getPostcodeData: PropTypes.func.isRequired,
  raisePostcodeError: PropTypes.func.isRequired,
  getUserLocation: PropTypes.func.isRequired,
  geolocatingInProgress: PropTypes.bool.isRequired,
};

export default GeographyLookup;
