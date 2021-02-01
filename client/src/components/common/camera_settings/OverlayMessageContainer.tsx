import { sendMessage } from 'api/common/camera';
import React from 'react';
import OverlayMessage from 'components/common/camera_settings/OverlayMessage';

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
