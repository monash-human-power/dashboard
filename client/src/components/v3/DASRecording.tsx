import {
  startLogging,
  stopLogging,
  startBoost,
  stopBoost,
  useModuleDataCallback,
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
  const [loggingEnabled, setLoggingEnabled] = useState(false);

  useModuleDataCallback(1, () => setLoggingEnabled(true));
  useModuleDataCallback(2, () => setLoggingEnabled(true));
  useModuleDataCallback(3, () => setLoggingEnabled(true));
  useModuleDataCallback(4, () => setLoggingEnabled(true));

  /** Start DAS recording and BOOST computations */
  function startRecording() {
    toast.success('DAS & BOOST recording is started!');
    setLoggingEnabled(true);
    startLogging();
    startBoost();
  }

  /** Stop DAS recording and BOOST computations */
  function stopRecording() {
    toast.success('DAS & BOOST recording is stopped!');
    setLoggingEnabled(false);
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
        disabled={loggingEnabled}
      >
        Start
      </Button>
      <Button
        className="ml-2"
        variant="outline-danger"
        onClick={stopRecording}
        disabled={!loggingEnabled}
      >
        Stop
      </Button>
    </>
  );
}
