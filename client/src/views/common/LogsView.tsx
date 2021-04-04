import React, { useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import ContentPage from 'components/common/ContentPage';
import DeleteModal from 'components/common/download_files/DeleteModal';
import LogFileList from 'components/common/download_files/LogFileList';
import { LogFile, useFiles, useLatestFile } from 'api/common/files';

/**
 * Download Files page component
 *
 * @returns {React.Component} Component
 */
export default function LogsView() {
  const { files, deleteFile } = useFiles();
  const latestFileURL = useLatestFile();
  const [deletingFile, setDeletingFile] = useState<LogFile | null>(null);

  const hideConfirmDelete = useCallback(() => {
    setDeletingFile(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletingFile) deleteFile(deletingFile);
    hideConfirmDelete();
  }, [deleteFile, deletingFile, hideConfirmDelete]);

  return (
    <ContentPage title="Files">
      {files && files.length > 0 && (
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
