import React, { useState, useCallback } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import ContentPage from 'components/ContentPage';
import DeleteModal from 'components/DeleteModal';
import WidgetListGroupItem from 'components/WidgetListGroupItem';
import { useFiles, useLatestFile } from 'api/v2/files';

/**
 * Download Files page component
 *
 * @returns {React.Component} Component
 */
export default function DownloadFilesView() {
  const { files, deleteFile } = useFiles();
  const latestFileURL = useLatestFile();
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
    <ContentPage title="Files">
      {files.length > 0 && (
        <Button
          href={latestFileURL}
          target="_blank"
          variant="secondary"
          className="mb-2"
        >
          Download latest
        </Button>
      )}
      <ListGroup>
        {fileList}
      </ListGroup>

      {files.length === 0 ? 'No log files found.' : null}

      <DeleteModal
        show={deletingFile !== null}
        name={deletingFile ? deletingFile.fileName : ''}
        onCancel={hideConfirmDelete}
        onDelete={handleConfirmDelete}
      />
    </ContentPage>
  );
}
