import React, { useState, useCallback } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import DeleteModal from 'components/DeleteModal';
import WidgetListGroupItem from 'components/WidgetListGroupItem';
import { useFiles } from 'api/v2/files';

export default function DownloadFilesView() {
  const [files, deleteFile] = useFiles();
  const [deletingFile, setDeletingFile] = useState(null);

  const hideConfirmDelete = useCallback(() => {
    setDeletingFile(null);
  }, []);

  const handleDelete = useCallback((event, file) => {
    event.preventDefault();
    setDeletingFile(file);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteFile(deletingFile);
    hideConfirmDelete();
  }, [deleteFile, deletingFile, hideConfirmDelete]);

  const fileList = files.map((file) => (
    <WidgetListGroupItem
      key={file.url}
      title={file.fileName}
      action
      href={file.url}
      target="_blank"
    >
      <Button
        variant="danger"
        size="sm"
        onClick={(e) => handleDelete(e, file)}
      >
        Delete
      </Button>
    </WidgetListGroupItem>
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
