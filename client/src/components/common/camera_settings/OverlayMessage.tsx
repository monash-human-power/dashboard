import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import styles from 'components/common/camera_settings/OverlayMessage.module.css';

export interface OverlayMessageProps {
  sendMessage: (message: string) => void;
}

type Message = {
  id: number;
  text: string;
  time: Date;
};

/**
 * Table for displaying previously sent messages.
 *
 * @param props Props
 * @returns Component
 */
function MessageHistory(props: { history: Message[] }) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateElapsed = useCallback(
    (time) => {
      let elapsed = (now.getTime() - time.getTime()) / 1000; // Elapsed seconds
      if (elapsed < 1) {
        // Display 'now' if sent less than a second ago
        return 'now';
      }
      // Finding best unit of time to use
      let unit = '';
      const units = [
        { label: ' sec', divisor: 1 },
        { label: ' min', divisor: 60 },
        { label: ' hour', divisor: 60 * 60 },
        { label: ' day', divisor: 60 * 60 * 24 },
      ];
      for (let i = units.length - 1; i >= 0; i -= 1) {
        if (elapsed >= units[i].divisor) {
          elapsed /= units[i].divisor;
          unit = units[i].label;
          break;
        }
      }
      unit += elapsed >= 2 ? 's' : '';
      return Math.floor(elapsed).toString().concat(unit);
    },
    [now],
  );

  const { history } = props;
  return (
    <table className={styles.table} id="messageTable">
      <thead>
        <tr>
          <th>Message</th>
          <th>Time</th>
          <th className={styles.table_time}>Elapsed</th>
        </tr>
      </thead>
      <tbody>
        {history.map(
          ({ id, text, time }: { id: number; text: string; time: Date }) => (
            <tr key={id}>
              <td className={styles.table_message}>{text}</td>
              <td className={styles.table_time}>
                {time.toLocaleTimeString('en-AU')}
              </td>
              <td>{calculateElapsed(time)}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}

/**
 * Text field for sending messages to the rider via the active overlay.
 *
 * @param props Props
 * @returns Component
 */
export default function OverlayMessage({ sendMessage }: OverlayMessageProps) {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState(0);

  const [history, setHistory] = useState<Message[]>([]);
  const handleMessageChange = useCallback(
    (event) => setMessage(event.target.value),
    [setMessage],
  );

  const handleMessage = useCallback(() => {
    const newMessage: Message = {
      id: key,
      text: message,
      time: new Date(),
    };
    setKey(key + 1);
    setHistory((x) => [newMessage, ...x]);
    sendMessage(message);
    setMessage('');
  }, [message, setMessage, sendMessage, key, setKey]);

  const handleKeyPressed = useCallback(
    (event) => {
      if (event.key === 'Enter') handleMessage();
    },
    [handleMessage],
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
        {history.length > 0 && <MessageHistory history={history} />}
      </Card.Body>
    </Card>
  );
}
