import React from 'react';
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

export const Simple = createStory(Template, {
  powerPlanConfigs: ['my_plan_1.json', 'this_one_gets_you_to_144.json'],
  riderConfigs: ['al.json', 'charles.json'],
  bikeConfigs: ['blacksmith.json', 'wombat.json', 'precilla.json'],
  trackConfigs: ['ford.json', 'holden.json', 'battle_mountain.json'],
});
