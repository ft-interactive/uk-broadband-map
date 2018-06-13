/**
 * @file
 * Button for geolocating a user
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'react-icons-kit';
import { target } from 'react-icons-kit/icomoon/target';
import { spinner2 } from 'react-icons-kit/icomoon/spinner2';
import * as actions from '../../../state/actions';
import './styles.scss';

const GeolocateMe = ({ getUserLocation, geolocatingInProgress, geolocationError }) =>
  (geolocatingInProgress ? (
    <div className="geolocate__button geolocate__loading">
      <Icon className="geolocate__spinner" icon={spinner2} />
    </div>
  ) : (
    <Fragment>
      <button
        className={`geolocate__button${geolocationError && ' geolocate__button--disabled'}`}
        disabled={geolocationError}
      >
        <Icon className="geolocate__icon" icon={target} onClick={getUserLocation} />
      </button>
      {geolocationError && <div className="geolocate__error-message">{geolocationError}</div>}
    </Fragment>
  ));

GeolocateMe.propTypes = {
  geolocationError: PropTypes.string.isRequired,
  geolocatingInProgress: PropTypes.bool.isRequired,
  getUserLocation: PropTypes.func.isRequired,
};

export default connect(state => state, actions)(GeolocateMe);
