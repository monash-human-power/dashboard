import React from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import { useMessageState } from 'api/v2/camera';

/**
 * Text field for sending messages to the rider via the active overlay.
 *
 * @returns {React.Component} Component
 */
export default function OverlayMessage() {
  const {
    message,
    received,
    sending,
    setMessage,
    sendMessage,
  } = useMessageState();

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyPressed = (event) => {
    if (event.key === 'Enter') sendMessage();
  };

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
            <Button variant="outline-secondary" onClick={sendMessage}>
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <span>{sending ? 'Sending...' : ''}</span>
        <span>{received ? 'Message sent!' : ''}</span>
      </Card.Body>
    </Card>
  );
}
