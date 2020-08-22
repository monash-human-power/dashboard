import React, { useCallback, useRef } from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import { sendMessage, useMessageReceived } from 'api/v2/camera';

/**
 * Text field for sending messages to the rider via the active overlay.
 */
export default function OverlayMessage() {
  const message = useRef(null);
  const messageReceived = useMessageReceived();

  const handleMessageSubmit = useCallback(() => {
    sendMessage(message.current.value);
    message.current.value = '';
  }, []);

  const handleMessageKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      handleMessageSubmit();
    }
  });

  return (
    <Card>
      <Card.Body>
        <Card.Title>Overlay message</Card.Title>
        <InputGroup className="mt-3">
          <FormControl
            ref={message}
            placeholder="Message for rider"
            onKeyPress={handleMessageKeyPress}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={handleMessageSubmit}>
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
        {messageReceived ? 'Message sent!' : ''}
      </Card.Body>
    </Card>
  );
}
