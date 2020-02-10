import React, { useState, useCallback } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import ContentPage from 'components/ContentPage';
import DeleteModal from 'components/DeleteModal';
import WidgetListGroupItem from 'components/WidgetListGroupItem';
import LogFileModal from 'components/v2/LogFileModal';
import { useFiles } from 'api/v2/files';

/**
 * Download Files page component
 *
 * @returns {React.Component} Component
 */
export default function DownloadFilesView() {
  const { files, deleteFile } = useFiles();
  const [deletingFile, setDeletingFile] = useState(null);
  const [previewingFile, setPreviewingFile] = useState(null);

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

  const handlePreview = useCallback((event, file) => {
    event.preventDefault();
    setPreviewingFile(file);
  }, []);

  const handleHidePreview = useCallback(() => {
    setPreviewingFile(null);
  }, []);

  const fileList = files.map((file) => (
    <WidgetListGroupItem
      key={file.url}
      title={file.fileName}
      action
      href={file.url}
      target="_blank"
    >
      <span>
        <Button
          className="mr-2"
          variant="secondary"
          size="sm"
          onClick={(e) => handlePreview(e, file)}
        >
          Preview
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => handleDelete(e, file)}
        >
          Delete
        </Button>
      </span>
    </WidgetListGroupItem>
  ));

  return (
    <ContentPage title="Files">
      <ListGroup>
        {fileList}
      </ListGroup>

      <DeleteModal
        show={deletingFile !== null}
        name={deletingFile ? deletingFile.fileName : ''}
        onCancel={hideConfirmDelete}
        onDelete={handleConfirmDelete}
      />
      <LogFileModal
        show={previewingFile !== null}
        file={previewingFile}
        onHide={handleHidePreview}
      />
    </ContentPage>
  );
}
