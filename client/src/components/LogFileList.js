import React from 'react';
import { Button } from 'react-bootstrap';
import WidgetListGroupItem from 'components/WidgetListGroupItem';
import LogFile from '../api/v2/files';

/**
 * @typedef {object} LogFileListProps
 * @property {LogFile[]} files List of log files to display
 * @property {(file: string) => void} onDeleteFile Function called when user deletes a log
 */

/**
 * List of log files with delete buttons
 *
 * @param {LogFileListProps} Props props
 * @returns {React.Component<LogFileListProps>} Component
 */
export default function LogFileList({ loading, files, onDeleteFile }) {
  const handleDelete = (event, file) => {
    event.preventDefault();
    onDeleteFile(file);
  };

  const fileList = files.map((file) => (
    <WidgetListGroupItem
      key={file.url}
      title={file.fileName}
      action
      href={file.url}
      target="_blank"
    >
      <Button variant="danger" size="sm" onClick={handleDelete}>
        Delete
      </Button>
    </WidgetListGroupItem>
  ));

  if (loading) return 'Loading...';

  return fileList.length === 0 ? 'No log files found.' : fileList;
}

LogFileList.defaultProps = {
  loading: false,
};