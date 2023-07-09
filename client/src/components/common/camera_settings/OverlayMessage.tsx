import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import styles from 'components/common/camera_settings/OverlayMessage.module.css';
import toast from 'react-hot-toast';
import { useBikeVersion } from 'router';

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
function MessageHistory(props: {
  history: Message[];
  time12Hour: boolean;
  setNow: any;
  now: Date;
}) {
  const { now, setNow, history } = props;

  useEffect(() => {
    // Update 'now' every 60 seconds after a minute, otherwise every second
    const delay =
      now.getTime() - history[0].time.getTime() > 60 * 1000 ? 60 : 1;

    // Recalls this function every 1 or 60 seconds
    const timer = setTimeout(() => {
      setNow(new Date());
    }, delay * 1000);

    // Clear timer in case multiple timeouts are made
    return () => clearTimeout(timer);
  }, [now, history, setNow]);

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
      return `${Math.floor(elapsed)} ${unit} ago`;
    },
    [now],
  );

  const { time12Hour } = props;
  return (
    <div className={styles.history}>
      {history.map(
        ({ id, text, time }: { id: number; text: string; time: Date }) => (
          <div key={id} className={styles.history_message}>
            <div className={styles.history_time}>
              {time.toLocaleTimeString('en-AU', { hour12: time12Hour })},{' '}
              {calculateElapsed(time)}
            </div>
            <div className={styles.history_text}>{text}</div>
          </div>
        ),
      )}
    </div>
  );
}

/**
 * Text field for sending messages to the rider via the active overlay.
 *
 * @param props Props
 * @returns Component
 */
export default function OverlayMessage({ sendMessage }: OverlayMessageProps) {
  const [message, setMessage] = useState(''); // Current message
  const [history, setHistory] = useState<Message[]>([]); // History of messages
  const [key, setKey] = useState(0); // Key used for history array
  const [time12Hour, setTime12Hour] = useState(true); // Use 12 or 24 hour time
  const [now, setNow] = useState<Date>(new Date());

  const bikeVersionId = useBikeVersion()?.id || '';
  const historyKeyBike = `dashboard-camera-system-messages-key-${bikeVersionId}`;

  useEffect(() => {
    // Check if there are any messages in local storage and imports them
    const savedMessages = localStorage.getItem(historyKeyBike);
    if (savedMessages) {
      // If a save exists
      const parsedMessages: Message[] = JSON.parse(savedMessages);
      if (parsedMessages.length > 0) {
        // If the save has messages
        const messageHistory = parsedMessages.map((messages) => ({
          ...messages,
          time: new Date(messages.time),
        }));
        setHistory(messageHistory);
        setKey(messageHistory[0].id + 1);
      }
    }
  }, [historyKeyBike]);

  const handleMessageChange = useCallback(
    (event) => setMessage(event.target.value),
    [setMessage],
  );

  const handleMessage = useCallback(() => {
    if (message.trim() !== '') {
      const newMessage: Message = {
        id: key,
        text: message,
        time: new Date(),
      };
      setKey(key + 1);
      setHistory((x) => [newMessage, ...x]);
      sendMessage(message);
      setNow(new Date()); // Activates the useEffect in MessageHistory to update elapsed times
    }
    setMessage('');
  }, [message, setMessage, sendMessage, key, setKey]);

  const deleteHistory = useCallback(() => {
    toast.success(
      `${history.length} message${history.length > 1 ? 's' : ''} deleted!`,
    );
    setHistory([]);
  }, [history.length]);

  useEffect(() => {
    // Save history in localStorage whenever history is updated
    localStorage.setItem(historyKeyBike, JSON.stringify(history));
  }, [history, historyKeyBike]);

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
        {history.length > 0 && (
          <MessageHistory
            history={history}
            time12Hour={time12Hour}
            setNow={setNow}
            now={now}
          />
        )}
      </Card.Body>
      {history.length > 0 && (
        <Card.Footer>
          <Button
            className="ml-2"
            variant="outline-primary"
            onClick={() => setTime12Hour(!time12Hour)}
          >
            {time12Hour ? '24' : '12'} Hour time
          </Button>
          <Button
            className="ml-2"
            variant="outline-danger"
            onClick={deleteHistory}
          >
            Delete History
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
}
