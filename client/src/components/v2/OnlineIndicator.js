import PropTypes from 'prop-types';
import React from 'react';
import Indicator from './Indicator';

/**
 * @typedef {object} OnlineIndicatorProps
 * @property {string}           online State of the indicator
 */

/**
 * Indicator for Online / Offline
 *
 * @param {OnlineIndicatorProps} props Props
 * @returns {React.Component<OnlineIndicatorProps>} Component
 */
export default function OnlineIndicator({ online }) {
    return (
        <Indicator variant={online ? 'success' : 'danger'}>
            {online ? 'ON' : 'OFF'}
        </Indicator>
    );
}

OnlineIndicator.propTypes = {
    online: PropTypes.bool.isRequired
};
