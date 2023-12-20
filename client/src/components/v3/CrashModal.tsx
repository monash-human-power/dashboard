import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useChannelShaped } from 'api/common/socket';
import { CrashAlertRT, CrashAlertT } from 'types/crashAlert';

/**
 * Displays modal if vehicle has crashed
 *
 * @returns Component
 */
export default function CrashModal(): JSX.Element {
  const [isCrashed, setIsCrashed] = useState<CrashAlertT>({ value: false });

  // Listen into crash_detection topic and check if crash has occured
  useChannelShaped(
    'wireless_module-3-crash_detection',
    CrashAlertRT,
    setIsCrashed,
  );

  // Tracking time of latest crash
  const [crashTime, setCrashTime] = useState<String | null>(null);

  // Tracking number of crashes since modal appeared
  const [counter, setCounter] = useState(0);
  const increase = () => {
    setCounter((count) => count + 1);
  };

  const displayCounter = () => {
    return counter > 1 ? `(${counter}) ` : '';
  };

  const [showCrashModal, setShowCrashModal] = useState(false);

  const hideModal = () => {
    setShowCrashModal(false);
    setIsCrashed({ value: false });
    setCounter(0);
  };

  useEffect(() => {
    if (isCrashed.value) {
      const now = new Date();
      setCrashTime(now.toLocaleTimeString());

      if (!showCrashModal) {
        setShowCrashModal(true);
      } else {
        increase();
      }
    }
  }, [isCrashed, showCrashModal, setCrashTime]);

  return (
    <>
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
            Timestamp:<span> </span>
            {crashTime}
          </h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={hideModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
