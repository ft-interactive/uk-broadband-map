import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-icons-kit';
import { notification } from 'react-icons-kit/icomoon/notification';
import { search } from 'react-icons-kit/icomoon/search';
import './styles.scss';

const postcodeRegex = /^([Gg][Ii][Rr] ?0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) ?[0-9][A-Za-z]{2})$/i;

class GeographyLookup extends PureComponent {
  textInput = React.createRef();

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
      <form
        className={`locate-user__form${
          this.props.postcodeError ? ' locate-user__form--validation-error' : ''
        }`}
        onSubmit={this.handleSubmit}
      >
        <label htmlFor="locate-user__text">Go to a postcode</label>
        <div className="locate-user__affix-wrapper">
          <input
            type="text"
            placeholder="Enter your postcode…"
            ref={this.textInput}
            id="geography"
            className="locate-user__text"
            name="locate-user__text"
          />
          <div className="locate-user__suffix">
            <button type="button" className="locate-user__button" onClick={this.handleSubmit}>
              <i className={this.props.postcodeError ? 'warning-icon' : 'search-icon'} />
            </button>
          </div>
        </div>
        <div className="locate-user__validation-error-text">{this.props.postcodeError}</div>
      </form>
    );
  }
}

GeographyLookup.propTypes = {
  postcodeError: PropTypes.string.isRequired,
  getPostcodeData: PropTypes.func.isRequired,
  raisePostcodeError: PropTypes.func.isRequired,
};

export default GeographyLookup;
