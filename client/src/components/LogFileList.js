import React from 'react';
import { Button } from 'react-bootstrap';
import WidgetListGroupItem from 'components/WidgetListGroupItem';

export default function LogFileList({ files, onDeleteFile }) {
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

  return fileList.length === 0 ? 'No log files found.' : fileList;
}
