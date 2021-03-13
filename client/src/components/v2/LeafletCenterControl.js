import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useLeaflet } from 'react-leaflet';
import Control from 'react-leaflet-control';

import FontAwesomeIcon from 'components/common/FontAwesomeIcon';

/**
 * @typedef {object} LeafletCenterControlProps
 * @property {{lat: number, lng:number}|Array.<number>} center Center position
 */

/**
 * Re-center button control for Leaflet
 *
 * @param {LeafletCenterControlProps} props Props
 * @returns {JSX.Element} Component
 */
export default function LeafletCenterControl({ center }) {
  const context = useLeaflet();

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      context.map.panTo(center);
    },
    [center, context],
  );

  return (
    <Control position="bottomright" className="leaflet-bar">
      <a href="#" role="button" onClick={handleClick}>
        <FontAwesomeIcon icon={faLocationArrow} />
      </a>
    </Control>
  );
}

LeafletCenterControl.propTypes = {
  center: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
  ]).isRequired,
};
