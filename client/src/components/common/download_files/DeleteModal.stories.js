import React from 'react';
import DeleteModal from 'components/common/download_files/DeleteModal';

export default {
  title: 'components/common/download_files/DeleteModal',
  component: DeleteModal,
  argTypes: {
    onDeleteFile: { action: 'clicked' },
  },
};

const Template = (args) => <DeleteModal {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  name: 'example_log_file.csv',
  show: true,
};

export const Hidden = Template.bind({});
Hidden.args = {
  show: false,
};
