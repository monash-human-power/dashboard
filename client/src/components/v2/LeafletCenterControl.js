import React, { useCallback } from 'react';
import Control from 'react-leaflet-control';
import { useLeaflet } from 'react-leaflet';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from 'components/common/FontAwesomeIcon';

/**
 * Re-center button control for Leaflet (v2 API)
 * @param {{ center: {lat:number,lng:number}|[number,number], position?: 'topleft'|'topright'|'bottomleft'|'bottomright' }} props
 */
export default function LeafletCenterControl({
  center,
  position = 'bottomright',
}) {
  const context = useLeaflet(); // v2 hook → gives { map }

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (!context || !context.map || !center) return;
      const target = Array.isArray(center) ? center : [center.lat, center.lng];
      context.map.panTo(target);
    },
    [context, center],
  );

  return (
    <Control position={position} className="leaflet-bar">
      <a href="#" role="button" onClick={handleClick} title="Re-center">
        <FontAwesomeIcon icon={faLocationArrow} />
      </a>
    </Control>
  );
}
