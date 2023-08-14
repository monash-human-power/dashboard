import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const [showCrashModal, setShowCrashModal] = useState(false);
const displayModal = () => setShowCrashModal(true);
const hideModal = () => setShowCrashModal(false);

const [counter, setCounter] = useState(0);
const increaseCounter = () => setCounter((counter) => counter + 1);
const resetCounter = () => setCounter((counter) => 0);

const displayCounter = () => {
  return counter > 1 ? '(' + { counter } + ')' : '';
};

function CrashModal() {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={displayModal}
      onHide={hideModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          💥Crash Alert💥 {displayCounter()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Ya bois crashed, someone go get dis dude</h4>
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
}

export default <CrashModal></CrashModal>;
