import React, { useCallback } from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import { sendMessage, useMessageState } from 'api/v2/camera';

/**
 * Text field for sending messages to the rider via the active overlay.
 */
export default function OverlayMessage() {
  const [state, setMessage] = useMessageState();

  const handleMessageSubmit = useCallback(() => {
    sendMessage(state.message);
    setMessage('');
  });

  const handleMessageChange = useCallback((event) => {
    setMessage(event.target.value);
  });

  return (
    <Card>
      <Card.Body>
        <Card.Title>Overlay message</Card.Title>
        <InputGroup className="mt-3">
          <FormControl
            onChange={handleMessageChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') handleMessageSubmit();
            }}
            placeholder="Message for rider"
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={handleMessageSubmit}>
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
        {state.received ? 'Message sent!' : ''}
      </Card.Body>
    </Card>
  );
}
