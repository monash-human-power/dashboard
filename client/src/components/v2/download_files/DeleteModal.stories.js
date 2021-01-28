import React from 'react';
import DeleteModal from 'components/v2/download_files/DeleteModal';

export default {
  title: 'DeleteModal',
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
