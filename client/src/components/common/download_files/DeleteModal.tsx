import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * @typedef DeleteModalProps
 * @property name      Name of object to be deleted
 * @property show      Whether to show the modal
 * @property onDelete  Called if delete confirmed
 * @property onCancel  Called if delete cancelled
 */

export interface DeleteModalProps {
  /** Name of object to be deleted */
  name: string;
  /** Whether to show the model */
  show: boolean;
  /** Called if delete confirmed */
  onDelete: () => void;
  /** Called if delete cancelled */
  onCancel: () => void;
}

/**
 * Delete confirmation modal component
 *
 * @param props Props
 * @returns Component
 */
export default function DeleteModal({
  name,
  show,
  onDelete,
  onCancel,
}: DeleteModalProps): JSX.Element {
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
