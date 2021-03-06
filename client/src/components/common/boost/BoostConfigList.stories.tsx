import React from 'react';
import { action } from '@storybook/addon-actions';
import { addArgs, createStory } from 'utils/stories';
import BoostConfigList, {
  BoostConfigListProps,
} from 'components/common/boost/BoostConfigList';

export default {
  title: 'components/common/boost/BoostConfigList',
  component: BoostConfigList,
};

const Template = addArgs<BoostConfigListProps>((props) => (
  <BoostConfigList {...props} />
));

const onSelectConfig = action('onSelectConfig');
const onDeleteConfig = action('onDeleteConfig');

export const Simple = createStory(Template, {
  config: {
    type: 'powerPlan',
    options: [
      { displayName: 'My first config', fileName: 'my_first_config.json' },
      { displayName: 'My second config', fileName: 'my_second_config.json' },
    ],
    active: {
      displayName: 'My first config',
      fileName: 'my_first_config.json',
    },
  },
  onSelectConfig,
  onDeleteConfig,
});

export const Empty = createStory(Template, {
  config: {
    type: 'powerPlan',
    options: [],
  },
  onSelectConfig,
  onDeleteConfig,
});
