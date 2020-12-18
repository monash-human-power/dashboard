import { sendMessage } from 'api/v2/camera';
import React, { useCallback, useState } from 'react';
import OverlayMessage from './OverlayMessage';

/**
 * Container for {@link OverlayMessage}
 *
 * @returns Component
 */
export default function OverlayMessageContainer() {
    const [message, setMessage] = useState('');

    const handleMessageChange = useCallback(
        (event) => setMessage(event.target.value),
        [setMessage],
    );

    const handleKeyPressed = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                sendMessage(message);
                setMessage('');
            }
        },
        [message, setMessage],
    );

    return (
        <OverlayMessage
            message={message}
            handleMessageChange={handleMessageChange}
            handleKeyPressed={handleKeyPressed}
        />
    );
}
