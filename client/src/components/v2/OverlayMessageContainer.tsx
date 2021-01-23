import { sendMessage } from 'api/v2/camera';
import React from 'react';
import OverlayMessage from './OverlayMessage';

/**
 * Container for {@link OverlayMessage}
 *
 * @returns Component
 */
export default function OverlayMessageContainer() {
    return (
        <OverlayMessage sendMessage={sendMessage} />
    );
}
