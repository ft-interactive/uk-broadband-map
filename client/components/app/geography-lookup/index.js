import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const postcodeRegex = /^([Gg][Ii][Rr] ?0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) ?[0-9][A-Za-z]{2})$/i;

class GeographyLookup extends PureComponent {
  handleSubmit = (evt) => {
    evt.preventDefault(); // Prevent form submission
    const postcode = this.props.value;
    try {
      if (!postcodeRegex.test(postcode) && postcode !== '') {
        throw new Error(`Postcode ${postcode.toUpperCase()} is invalid`);
      } else if (
        postcode
          .toLowerCase()
          .replace(/\s/g, '')
          .startsWith('bt')
      ) {
        throw new Error(`Postcode ${postcode.toUpperCase()} is in Northern Ireland`);
      }

      this.props.getPostcodeData(postcode);
      document.activeElement.blur(); // Hide mobile keyboard
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
        action="#"
        onSubmit={this.handleSubmit}
      >
        <label htmlFor="locate-user__text">Zoom to a postcode</label>
        <div className="locate-user__affix-wrapper">
          <input
            type="text"
            placeholder="Enter your postcode"
            onChange={e => this.props.onChange(e.target.value)}
            value={this.props.value}
            id="geography"
            className="locate-user__text"
            name="locate-user__text"
            autoCorrect="false"
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
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

GeographyLookup.defaultProps = {
  value: '',
};

export default GeographyLookup;
