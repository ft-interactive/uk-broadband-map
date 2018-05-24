/**
 * @file
 * Button for geolocating a user
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'react-icons-kit';
import { target } from 'react-icons-kit/icomoon/target';
import { spinner2 } from 'react-icons-kit/icomoon/spinner2';
import './styles.scss';

const GeolocateMe = ({ getUserLocation, geolocatingInProgress }) =>
  (geolocatingInProgress ? (
    <Icon className="spin" icon={spinner2} />
  ) : (
    <button>
      <Icon className="geolocate" icon={target} onClick={getUserLocation} />
    </button>
  ));

GeolocateMe.propTypes = {
  geolocatingInProgress: PropTypes.bool.isRequired,
  getUserLocation: PropTypes.func.isRequired,
};

export default GeolocateMe;
