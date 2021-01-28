import React from 'react';
import { action } from '@storybook/addon-actions';
import { addArgs, createStory } from 'utils/stories';
import { BoostConfig } from 'types/boost';
import BoostConfigurator, { BoostConfiguratorProps } from './BoostConfigurator';

export default {
  title: 'BoostConfigurator',
  component: BoostConfigurator,
};

const Template = addArgs<BoostConfiguratorProps>((props) => (
  <BoostConfigurator {...props} />
));

const baseConfigs: BoostConfig[] = [
  {
    type: 'powerPlan',
    options: ['my_plan_1.json', 'this_one_gets_you_to_144.json'],
    active: 'my_plan_1.json',
  },
  {
    type: 'rider',
    options: ['al.json', 'charles.json'],
    active: 'charles.json',
  },
  {
    type: 'bike',
    options: ['blacksmith.json', 'wombat.json', 'precilla.json'],
    active: 'wombat.json',
  },
  {
    type: 'track',
    options: ['ford.json', 'holden.json', 'battle_mountain.json'],
    active: 'ford.json',
  },
];

const handlers = {
  onSelectConfig: action('onSelectConfig'),
  onDeleteConfig: action('onDeleteConfig'),
  onUploadConfig: action('onUploadConfig'),
};

export const Simple = createStory(Template, {
  ...handlers,
  configs: baseConfigs,
});

export const NoSelection = createStory(Template, {
  ...handlers,
  configs: baseConfigs.map(({ type, options, active }) =>
    // Omit `active` property for rider
    type === 'rider' ? { type, options } : { type, options, active },
  ),
});

export const NoOptions = createStory(Template, {
  ...handlers,
  configs: baseConfigs.map(({ type, options, active }) =>
    // Omit all options for rider
    type === 'rider' ? { type, options: [] } : { type, options, active },
  ),
});
