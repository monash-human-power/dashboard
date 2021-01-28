import React, { useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import ContentPage from 'components/v2/ContentPage';
import DeleteModal from 'components/v2/DeleteModal';
import LogFileList from 'components/v2/LogFileList';
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

  const handleConfirmDelete = useCallback(() => {
    deleteFile(deletingFile);
    hideConfirmDelete();
  }, [deleteFile, deletingFile, hideConfirmDelete]);

  return (
    <ContentPage title="Files">
      {files?.length > 0 && (
        <Button
          href={latestFileURL}
          target="_blank"
          variant="secondary"
          className="mb-2"
        >
          Download latest
        </Button>
      )}

      <LogFileList files={files} onDeleteFile={setDeletingFile} />

      <DeleteModal
        show={deletingFile !== null}
        name={deletingFile ? deletingFile.fileName : ''}
        onCancel={hideConfirmDelete}
        onDelete={handleConfirmDelete}
      />
    </ContentPage>
  );
}
