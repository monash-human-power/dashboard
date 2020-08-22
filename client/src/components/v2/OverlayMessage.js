import React, { useCallback } from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import { useMessageState } from 'api/v2/camera';

/**
 * Text field for sending messages to the rider via the active overlay.
 */
export default function OverlayMessage() {
  const [state, setMessage, sendMessage] = useMessageState();

  const handleMessageChange = useCallback((event) => {
    setMessage(event.target.value);
  });

  const handleKeyPressed = useCallback((event) => {
    if (event.key === 'Enter') sendMessage();
  });

  return (
    <Card>
      <Card.Body>
        <Card.Title>Overlay message</Card.Title>
        <InputGroup className="mt-3">
          <FormControl
            onChange={handleMessageChange}
            onKeyPress={handleKeyPressed}
            placeholder="Message for rider"
            value={state.message}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={sendMessage}>
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
        {state.sending ? 'Sending...' : ' '}{' '}
        {state.received ? 'Message sent!' : ''}
      </Card.Body>
    </Card>
  );
}
