import { startLogging, stopLogging } from 'api/common/data';
import { emit } from 'api/common/socket';
import React from 'react';
import { Button } from 'react-bootstrap';

/**
 * Turn recording off and on
 *
 * @returns Component
 */
export default function DASRecording(): JSX.Element {

  // start & stop boosting 
  function startBoosting(){
    emit('start-boost');
    
  }

  function stopBoosting(){
    emit('stop-boost');
  }

  return (
    <>
      <span style={{ fontWeight: 'bold' }}>DAS Recording:</span>
      <Button className="ml-3" variant="outline-success" onClick={() => {startLogging(); startBoosting();}}>
        Start
      </Button>
      <Button className="ml-2" variant="outline-danger" onClick={() => {stopLogging(); stopBoosting();}}>
        Stop
      </Button>
    </>
  );
}
