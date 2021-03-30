import { startLogging, stopLogging } from 'api/common/data';
import React from 'react';
import { Button } from 'react-bootstrap';

/**
 * Turn recording off and on
 *
 * @returns Component
 */
export default function DASRecording(): JSX.Element {
  return (
    <>
      <span style={{ fontWeight: 'bold' }}>DAS Recording:</span>
      <Button className="ml-3" variant="outline-success" onClick={startLogging}>
        Start
      </Button>
      <Button className="ml-2" variant="outline-danger" onClick={stopLogging}>
        Stop
      </Button>
    </>
  );
}
