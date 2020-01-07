import React, { useState, useCallback } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import DeleteModal from 'components/DeleteModal';
import { useFiles } from 'api/v2/files';

export default function DownloadFilesView() {
  const [files, deleteFile] = useFiles();
  const [deletingFile, setDeletingFile] = useState(null);

  function hideConfirmDelete() {
    setDeletingFile(null);
  }

  const handleDelete = useCallback((event, fileName) => {
    event.preventDefault();
    setDeletingFile(fileName);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteFile(deletingFile);
    hideConfirmDelete();
  }, [deleteFile, deletingFile]);

  const fileList = files.map((fileName) => (
    <ListGroup.Item
      key={fileName}
      action
      href={`/files/${fileName}`}
      target="_blank"
    >
      {fileName}
      <Button
        variant="danger"
        size="sm"
        className="float-right"
        onClick={(e) => handleDelete(e, fileName)}
      >
        Delete
      </Button>
    </ListGroup.Item>
  ));

  return (
    <Container>
      <h1>Files</h1>
      <ListGroup>
        {fileList}
      </ListGroup>

      <DeleteModal
        show={deletingFile !== null}
        name={deletingFile || ''}
        onCancel={hideConfirmDelete}
        onDelete={handleConfirmDelete}
      />
    </Container>
  );
}
