import React, { useCallback, useRef } from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import { sendMessage } from 'api/v2/camera';

/**
 * Text field for sending messages to the rider via the active overlay.
 */
export default function OverlayMessage() {
  const message = useRef(null);

  const handleMessageSubmit = useCallback(() => {
    sendMessage(message.current.value);
    message.current.value = '';
  }, []);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Overlay message</Card.Title>
        <InputGroup className="mt-3">
          <FormControl ref={message} placeholder="Message for rider" />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={handleMessageSubmit}>
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Card.Body>
    </Card>
  );
}
