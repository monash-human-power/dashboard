import React from 'react';
import { action } from '@storybook/addon-actions';
import { addArgs, createStory } from '../utils/stories';
import BoostConfigList, { BoostConfigListProps } from './BoostConfigList';

export default {
  title: 'BoostConfigList',
  component: BoostConfigList,
};

const Template = addArgs<BoostConfigListProps>((props) => (
  <BoostConfigList {...props} />
));

export const Simple = createStory(Template, {
  configNames: ['My first config', 'My second config'],
  activeConfig: 'My first config',
  onSelectConfig: action('onSelectConfig'),
  onDeleteConfig: action('onDeleteConfig'),
});

export const Empty = createStory(Template, {
  configNames: [],
  onSelectConfig: action('onSelectConfig'),
  onDeleteConfig: action('onDeleteConfig'),
});
