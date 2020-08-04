import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

/**
 * @typedef DeleteModalProps
 * @property {string}   name      Name of object to be deleted
 * @property {boolean}  show      Whether to show the modal
 * @property {Function} onDelete  Called if delete confirmed
 * @property {Function} onCancel  Called if delete cancelled
 */

/**
 * Delete confirmation modal component
 *
 * @param {DeleteModalProps} props Props
 * @returns {React.Component<DeleteModalProps>} Component
 */
export default function DeleteModal({ name, show, onDelete, onCancel }) {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete &quot;
        {name}
        &quot;?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

DeleteModal.propTypes = {
  name: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
