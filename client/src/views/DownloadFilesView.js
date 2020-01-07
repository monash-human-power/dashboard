import React, { useState } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import DeleteModal from 'components/DeleteModal';
import { useFiles } from 'api/v2/files';

export default function DownloadFilesView() {
  const [files, deleteFile] = useFiles();
  const [deletingFile, setDeletingFile] = useState(null);

  function hideConfirmDelete() {
    setDeletingFile(null);
  }

  function handleDelete(event, fileName) {
    event.preventDefault();
    setDeletingFile(fileName);
  }

  function handleConfirmDelete() {
    deleteFile(deletingFile);
    hideConfirmDelete();
  }

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
