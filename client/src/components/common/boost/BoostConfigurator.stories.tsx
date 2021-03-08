import React from 'react';
import { action } from '@storybook/addon-actions';
import { addArgs, createStory } from 'utils/stories';
import { BoostConfig } from 'types/boost';
import BoostConfigurator, { BoostConfiguratorProps } from 'components/common/boost/BoostConfigurator';

export default {
  title: 'components/common/boost/BoostConfigurator',
  component: BoostConfigurator,
};

const Template = addArgs<BoostConfiguratorProps>((props) => (
  <BoostConfigurator {...props} />
));

const baseConfigs: BoostConfig[] = [
  {
    type: 'powerPlan',
    options: [{fileName: 'my_plan_1.json', displayName: 'my_plan_1'}, {fileName: 'this_one_gets_you_to_144.json', displayName: '144'}],
    active: {fileName: 'my_plan_1.json', displayName: 'my_plan_1'},
  },
  {
    type: 'rider',
    options: [{fileName: 'al.json', displayName: 'AL'}, {fileName: 'charles.json', displayName: 'charles'}],
    active: {fileName: 'charles.json', displayName: 'charles'},
  },
  {
    type: 'bike',
    options: [{fileName: 'blacksmith.json', displayName: 'Black Smith'}, {fileName: 'wombat.json', displayName: 'Wombat'}, {fileName: 'precilla.json', displayName: 'Precilla'}],
    active: {fileName: 'wombat.json', displayName: 'Wombat'},
  },
  {
    type: 'track',
    options: [{fileName: 'ford.json', displayName: 'Ford'}, {fileName: 'holden.json', displayName: 'Holden'}, {fileName: 'battle_mountain.json', displayName: 'Battle Mountain'} ],
    active: {fileName: 'ford.json', displayName: 'Ford'},
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
