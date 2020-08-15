import PropTypes from 'prop-types';
import React from 'react';
import Indicator from './Indicator';

/**
 * @typedef {object} OnlineIndicatorProps
 * @property {string}           online State of the indicator
 * @property {?string}          on Text to display for "online" status
 * @property {?string}          off Text to display for "offline" status
 */

/**
 * Indicator for Online / Offline
 *
 * @param {OnlineIndicatorProps} props Props
 * @returns {React.Component<OnlineIndicatorProps>} Component
 */
export default function OnlineIndicator({ online, on, off }) {
    return (
        <Indicator variant={online ? 'success' : 'danger'}>
            {online ? on : off}
        </Indicator>
    );
}

OnlineIndicator.defaultProps = {
    on: 'ON',
    off: 'OFF'
};

OnlineIndicator.propTypes = {
    online: PropTypes.bool.isRequired,
    on: PropTypes.string,
    off: PropTypes.string
};
