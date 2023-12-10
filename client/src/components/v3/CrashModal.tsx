import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Boolean } from 'runtypes';

import { useChannelShaped } from 'api/common/socket';
// import { usePayload } from 'api/common/server';

export default function CrashModal(): JSX.Element {
  const now = new Date();

  // const [isCrashed, setIsCrashed] = useState(
  //   //channel shaped or use payload?
  //   usePayload(`/v3/wireless_module/3/crash_detection`, Boolean),
  // );

  const [isCrashed, setIsCrashed] = useState<boolean | null>(true);

  useChannelShaped(
    '/v3/wireless_module/3/crash_detection',
    Boolean,
    setIsCrashed,
  );

  console.log(
    'useing chahe',
    useChannelShaped(
      'wireless_module/3/crash_detection',
      Boolean,
      setIsCrashed,
    ),
  );

  const [counter, setCounter] = useState(0);
  const increase = () => {
    setCounter((count) => count + 1);
  };

  const displayCounter = () => {
    return counter > 1 ? `(${counter}) ` : '';
  };

  const [showCrashModal, setShowCrashModal] = useState(false);

  const displayModal = () => setShowCrashModal(true);

  const hideModal = () => {
    setShowCrashModal(false);
    setIsCrashed(false);
    setCounter(0);
  };

  // monitoring status of crash
  useEffect(() => {
    if (isCrashed) {
      if (!showCrashModal) {
        displayModal();
      } else {
        increase();
      }
    }
  }, [isCrashed, showCrashModal]);

  return (
    <>
      <Button
        onClick={() => {
          setIsCrashed(true);
        }}
      >
        hi just testing crash!
      </Button>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showCrashModal}
        onHide={hideModal}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <>💥Crash Alert💥 {displayCounter()}</>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>A crash has occured!</h4>
          <h4>
            Timestamp:
            {`  ${now.toLocaleTimeString()}`}
          </h4>
          <Button onClick={() => increase()}>Oh naur more crashes</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              hideModal();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
