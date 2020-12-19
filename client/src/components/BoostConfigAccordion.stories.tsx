import React from 'react';
import { action } from '@storybook/addon-actions';
import { addArgs, createStory } from 'utils/stories';
import BoostConfigAccordion, {
  BoostConfigAccordionProps,
} from './BoostConfigAccordion';

export default {
  title: 'BoostConfigAccordion',
  component: BoostConfigAccordion,
};

const Template = addArgs<BoostConfigAccordionProps>((props) => (
  <BoostConfigAccordion {...props} />
));

const onSelectConfig = action('onSelectConfig');
const onDeleteConfig = action('onDeleteConfig');

export const Simple = createStory(Template, {
  configs: [
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
  ],
  onSelectConfig,
  onDeleteConfig,
});
