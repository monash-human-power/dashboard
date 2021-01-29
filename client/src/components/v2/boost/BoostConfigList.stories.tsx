import React from 'react';
import { action } from '@storybook/addon-actions';
import { addArgs, createStory } from 'utils/stories';
import BoostConfigList, { BoostConfigListProps } from 'components/v2/boost/BoostConfigList';

export default {
  title: 'components/v2/boost/BoostConfigList',
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
    options: ['My first config', 'My second config'],
    active: 'My first config',
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
