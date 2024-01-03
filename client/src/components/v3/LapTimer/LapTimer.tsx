import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useChannel, emit } from 'api/common/socket';

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

  /** Resets timer. Should do after second and remaining messages from lap topic */
  function reset() {
    setTime(0);
  }

  /** Controls timer
   *
   * @returns nothing
   */
  function lap() {
    return isRunning ? reset() : start();
  }

  // Minutes calculation
  const minutes = Math.floor((time % 360000) / 6000);
  // Seconds calculation
  const seconds = Math.floor((time % 6000) / 100);
  // Milliseconds calculation
  const milliseconds = time % 100;

  /* Resets timer on MQTT message */
  useChannel('lap-recieved', lap);

  /** Posts on MQTT when lap is triggered through the online buttons */
  function postLap() {
    emit('lap-send');
  }

  return (
    <Card style={{ width: '13rem' }}>
      <Card.Body>
        <div>
          <h1>
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}:
            {milliseconds.toString().padStart(2, '0')}
          </h1>
          <Button
            className="ml-3"
            variant="outline-success"
            onClick={postLap} /* should post to lap topic */
            disabled={isRunning}
          >
            Start
          </Button>
          <Button
            className="ml-2"
            variant="outline-danger"
            onClick={postLap} /* should post to lap topic */
            disabled={!isRunning}
          >
            Lap
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
