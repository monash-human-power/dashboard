import React, { useCallback, useState } from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';

export interface OverlayMessageProps {
  sendMessage: (message: string) => void
}

/**
 * Text field for sending messages to the rider via the active overlay.
 *
 * @param props Props
 * @returns Component
 */
export default function OverlayMessage({ sendMessage }: OverlayMessageProps) {
  const [message, setMessage] = useState('');

  const handleMessageChange = useCallback(
    (event) => setMessage(event.target.value),
    [setMessage],
  );

  const handleMessage = useCallback(
    () => {
      sendMessage(message);
      setMessage('');
    },
    [message, setMessage, sendMessage],
  );

  const handleKeyPressed = useCallback(
    (event) => { if (event.key === 'Enter') handleMessage(); },
    [handleMessage]
  );

  return (
    <Card>
      <Card.Body>
        <Card.Title>Overlay message</Card.Title>
        <InputGroup className="mt-3">
          <FormControl
            onChange={handleMessageChange}
            onKeyPress={handleKeyPressed}
            placeholder="Message for rider"
            value={message}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={handleMessage}>
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}
