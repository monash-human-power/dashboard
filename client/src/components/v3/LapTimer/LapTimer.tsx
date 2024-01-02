import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
// import { useChannelShaped, emit } from 'api/common/socket';

/**
 * Show current lap time.
 *
 * @returns Component
 */
export default function LapTimer(): JSX.Element {
  // state to store time
  const [time, setTime] = useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  /** Starts timer. Should do after first message from lap topic */
  function start() {
    setIsRunning(true);
  }

  /** Resets timer. SHould do after second and remaining messages from lap topic */
  function lap() {
    setTime(0);
  }

  // Minutes calculation
  const minutes = Math.floor((time % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((time % 6000) / 100);

  // Milliseconds calculation
  const milliseconds = time % 100;

  return (
    <Card>
      <Card.Body>
        <div>
          <h1>Lap Timer</h1>
          <h1>
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}:
            {milliseconds.toString().padStart(2, '0')}
          </h1>
          <Button
            className="ml-3"
            variant="outline-success"
            onClick={start} /* should post to lap topic */
            disabled={isRunning}
          >
            Start
          </Button>
          <Button
            className="ml-2"
            variant="outline-danger"
            onClick={lap} /* should post to lap topic */
            disabled={!isRunning}
          >
            Lap
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
