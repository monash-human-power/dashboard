import React from 'react';
import { Button } from 'react-bootstrap';
import { LogFile } from 'api/common/files';
import WidgetListGroupItem from 'components/common/WidgetListGroupItem';

export interface LogFileListProps {
  /** List of log files to display */
  files: LogFile[] | null;
  /** Function called when user deletes a log */
  onDeleteFile: (file: LogFile) => void;
}

/**
 * List of log files with delete buttons
 *
 * @param Props props
 * @returns Component
 */
export default function LogFileList({ files, onDeleteFile }: LogFileListProps) {
  if (!files) return <>Loading...</>;
  if (files.length === 0) return <>No log files found.</>;

  const handleDelete = (event: React.MouseEvent, file: LogFile) => {
    event.preventDefault();
    onDeleteFile(file);
  };

  return (
    <>
      {files.map((file) => (
        <WidgetListGroupItem title={file.fileName} action href={file.url}>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => handleDelete(e, file)}
          >
            Delete
          </Button>
        </WidgetListGroupItem>
      ))}
    </>
  );
}
