import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default function CrashModal(): JSX.Element {
  const [showCrashModal, setShowCrashModal] = useState(false);
  const displayModal = () => setShowCrashModal(true); // mod so happens with mqqt
  const hideModal = () => setShowCrashModal(false);

  const [counter, setCounter] = useState(0);
  const increase = () => {
    setCounter((count) => count + 1);
  };
  const resetCounter = () => setCounter(0);

  const displayCounter = () => {
    return counter > 1 ? `(${counter}) ` : '';
  };

  return (
    <>
      <Button
        onClick={() => {
          displayModal();
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
          <h4>CRASH!</h4>
          <Button onClick={() => increase()}>Oh naur more crashes</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              hideModal();
              resetCounter();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      );
    </>
  );
}
