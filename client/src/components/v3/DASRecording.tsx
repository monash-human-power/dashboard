import {
  startV3,
  stopV3,
  useModuleDataCallback,
  useModuleStartCallback,
  useModuleStopCallback,
} from 'api/common/data';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
/**
 * Turn recording off and on
 *
 * @returns Component
 */
export default function DASRecording(): JSX.Element {
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const closeConfirmModal = () => setShowConfirmModal(false);
  const openConfirmModal = () => setShowConfirmModal(true);

  useModuleStartCallback(1, () => setLoggingEnabled(true));
  useModuleStartCallback(2, () => setLoggingEnabled(true));
  useModuleStartCallback(3, () => setLoggingEnabled(true));
  useModuleStartCallback(4, () => setLoggingEnabled(true));
  useModuleStartCallback(5, () => setLoggingEnabled(true));

  useModuleDataCallback(1, () => setLoggingEnabled(true));
  useModuleDataCallback(2, () => setLoggingEnabled(true));
  useModuleDataCallback(3, () => setLoggingEnabled(true));
  useModuleDataCallback(4, () => setLoggingEnabled(true));
  useModuleDataCallback(5, () => setLoggingEnabled(true));

  useModuleStopCallback(1, () => setLoggingEnabled(false));
  useModuleStopCallback(2, () => setLoggingEnabled(false));
  useModuleStopCallback(3, () => setLoggingEnabled(false));
  useModuleStopCallback(4, () => setLoggingEnabled(false));
  useModuleStopCallback(5, () => setLoggingEnabled(false));

  /** Start DAS recording and BOOST computations */
  function startRecording() {
    toast.success('DAS & BOOST recording is started!');
    setLoggingEnabled(true);
    startV3();
  }

  /** Stop DAS recording and BOOST computations */
  function stopRecording() {
    toast.success('DAS & BOOST recording is stopped!');
    setLoggingEnabled(false);
    stopV3();
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
        onClick={openConfirmModal}
        disabled={!loggingEnabled}
      >
        Stop
      </Button>

      <Modal show={showConfirmModal} onHide={closeConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Are You Sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Stopping DAS will stop all data flow, causing the data received so far
          to be saved into a csv file for later use.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={closeConfirmModal}>
            Cancel
          </Button>
          <Button
            variant="outline-success"
            onClick={() => {
              closeConfirmModal();
              stopRecording();
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
