import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import styles from 'components/common/camera_settings/OverlayMessage.module.css';

export interface OverlayMessageProps {
  sendMessage: (message: string) => void;
}

type Message = {
  text: string;
  time: Date;
  elapsed: string; // "5 seconds" or something
};

/**
 * Text field for sending messages to the rider via the active overlay.
 *
 * @param props Props
 * @returns Component
 */
export default function OverlayMessage({ sendMessage }: OverlayMessageProps) {
  const [message, setMessage] = useState('');

  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  const handleMessageChange = useCallback(
    (event) => setMessage(event.target.value),
    [setMessage],
  );

  const handleMessage = useCallback(() => {
    const newMessage: Message = {
      text: message,
      time: new Date(),
      elapsed: 'now',
    };
    setMessageHistory((x) => [newMessage, ...x]);
    sendMessage(message);
    setMessage('');
  }, [message, setMessage, sendMessage]);

  const handleKeyPressed = useCallback(
    (event) => {
      if (event.key === 'Enter') handleMessage();
    },
    [handleMessage],
  );

  const updateElapsed = useCallback(() => {
    const newMessageHistory = Object.create(messageHistory); // Deep copied
    for (let m = 0; m < newMessageHistory.length; m += 1) {
      let time =
        (new Date().getTime() - newMessageHistory[m].time.getTime()) / 1000; // Elapsed seconds
      // Finding best unit of time to use
      let unit: string;
      if (time < 60) {
        unit = ' sec';
      } else if (time < 60 * 60) {
        unit = ' min';
        time /= 60;
      } else if (time < 60 * 60 * 24) {
        unit = ' hour';
        time /= 60 * 60;
      } else {
        unit = ' day';
        time /= 60 * 60 * 24;
      }
      unit += time >= 2 ? 's' : '';
      newMessageHistory[m].elapsed = Math.floor(time).toString().concat(unit); // Updates dummy variable
    }
    setMessageHistory(newMessageHistory);
  }, [messageHistory, setMessageHistory]);

  useEffect(() => {
    // Updates elapsed times in messageHistory every second
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [updateElapsed]);

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
        {messageHistory.length > 0 && (
          <table className={styles.table} id="messageTable">
            <thead>
              <tr>
                <th>Message</th>
                <th>Time</th>
                <th className={styles.table_time}>Elapsed time</th>
              </tr>
            </thead>
            <tbody>
              {messageHistory.map(({ text, elapsed, time }) => (
                <tr>
                  <td className={styles.table_message}>{text}</td>
                  <td className={styles.table_time}>
                    {time.toLocaleTimeString('en-AU')}
                  </td>
                  <td>{elapsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card.Body>
    </Card>
  );
}
