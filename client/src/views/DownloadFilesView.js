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

  const handleDelete = useCallback((event, file) => {
    event.preventDefault();
    setDeletingFile(file);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteFile(deletingFile);
    hideConfirmDelete();
  }, [deleteFile, deletingFile]);

  const fileList = files.map((file) => (
    <ListGroup.Item
      key={file.fileName}
      action
      href={file.url}
      target="_blank"
    >
      {file.fileName}
      <Button
        variant="danger"
        size="sm"
        className="float-right"
        onClick={(e) => handleDelete(e, file)}
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
        name={deletingFile ? deletingFile.fileName : ''}
        onCancel={hideConfirmDelete}
        onDelete={handleConfirmDelete}
      />
    </Container>
  );
}
