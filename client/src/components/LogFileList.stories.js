import React from 'react';
import { ListGroup } from 'react-bootstrap';
import LogFileList from './LogFileList';

export default {
  title: 'LogFileList',
  component: LogFileList,
  decorators: [(story) => <ListGroup>{story()}</ListGroup>],
};

const Template = (args) => <LogFileList {...args} />;

const mockLogFile = (num) => {
  const fileName = `log_${num}.csv`;
  return { fileName, url: `/files/${fileName}` };
};

export const LogFiles = Template.bind({});
LogFiles.args = {
  files: [mockLogFile(1), mockLogFile(2), mockLogFile(3)],
};

export const Empty = Template.bind({});
Empty.args = {
  files: [],
};

export const Loading = Template.bind({});
Loading.args = {
  ...Empty.args,
  loading: true,
};
