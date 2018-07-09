/**
 * @file
 * Main app component
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Histogram from './histogram';
import ImageGrid from './image-grid';
import Map from './map';
import Key from './key';
import { propTypeSpeed } from '../../helpers/proptypes';
import './styles.scss';

// @TODO replace
const imageGrid1Images = require('./image-grid/placeholders.json');

const App = ({ speeds }) => (
  <Fragment>
    {window.PRELOADED_COPY.map(({ id, content }) => {
      switch (content) {
        case '<!-- Postcode input, Mapbox map and dynamic histogram -->':
          return <Map key={`map__${id}`} speeds={speeds} />;
        case '<!-- Lead urban/rural histogram here -->':
          return (
            <div className="o-grid-container" key={`histogram__${id}`}>
              <div className="o-grid-row">
                <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
                  <h2>
                    Britain’s broadband speeds:<br /> not just an urban-rural divide
                  </h2>
                </div>
              </div>
              <div className="o-grid-row histogram-national">
                <div data-o-grid-colspan="12 S11 Scenter M12 L11 XL10">
                  <Histogram speeds={speeds} />
                </div>
              </div>
            </div>
          );
        case '<!-- Image grid 1 -->':
          return (
            <div className="o-grid-container slow-cities" key={`image-grid__${id}`}>
              <div className="o-grid-row">
                <div data-o-grid-colspan="12 S11 center M9 L8 XL7">
                  <Key />
                </div>

                <ImageGrid images={imageGrid1Images}>
                  {({ alt, ...props }) => <img alt={alt} {...props} />}
                </ImageGrid>
              </div>
            </div>
          );
        case '<!-- Image grid 2 -->':
          return null;
        // return (
        //   <div className="o-grid-container" key={`image-grid__${id}`}>
        //     <div className="o-grid-row">
        //       <div data-o-grid-colspan="12 S11 center M9 L8 XL7">
        //         <ImageGrid images={imageGrid1Images} key={`image-grid__${id}`}>
        //           {({ alt, ...props }) => <img alt={alt} {...props} />}
        //         </ImageGrid>
        //       </div>
        //     </div>
        //   </div>
        // );
        default:
          return (
            <div className="o-grid-container" key={`copy__${id}`}>
              <div className="o-grid-row">
                <div data-o-grid-colspan="12 S11 Scenter M9 L8 XL7">
                  {/* eslint-disable-next-line */}
                  <p dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              </div>
            </div>
          );
      }
    })}
  </Fragment>
);

App.propTypes = {
  speeds: PropTypes.arrayOf(propTypeSpeed),
};

App.defaultProps = {
  speeds: [],
};

export default connect(({ speeds }) => ({ speeds }))(App);
