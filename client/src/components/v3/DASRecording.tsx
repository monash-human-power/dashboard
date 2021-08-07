import {
  startLogging,
  stopLogging,
  startBoost,
  stopBoost,
} from 'api/common/data';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

/**
 * Turn recording off and on
 *
 * @returns Component
 */
export default function DASRecording(): JSX.Element {
  const [startClicked, setNextStatus] = useState(false);

  /**
   * Start boost and DAS Recording
   */
  function startRecording() {
    toast.success('DAS & BOOST Recording is started!');
    setNextStatus(true);
    startLogging();
    startBoost();
  }

  /**
   * Stop Boost and DAS Recording
   */
  function stopRecording() {
    toast.success('DAS & BOOST Recording is stopped!');
    setNextStatus(false);
    stopLogging();
    stopBoost();
  }

  return (
    <>
      <span style={{ fontWeight: 'bold' }}>DAS & BOOST Recording:</span>
      <Button
        className="ml-3"
        variant="outline-success"
        onClick={startRecording}
        disabled={startClicked}
      >
        Start
      </Button>
      <Button
        className="ml-2"
        variant="outline-danger"
        onClick={stopRecording}
        disabled={!startClicked}
      >
        Stop
      </Button>
    </>
  );
}
