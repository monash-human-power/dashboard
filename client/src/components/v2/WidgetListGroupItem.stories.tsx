import React from 'react';
import { Button } from 'react-bootstrap';
import { addArgs, createStory } from '../../utils/stories';
import WidgetListGroupItem, {
  WidgetListGroupItemProps,
} from './WidgetListGroupItem';

export default {
  title: 'WidgetListGroupItem',
  component: WidgetListGroupItem,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

const Template = addArgs<WidgetListGroupItemProps>((props) => (
  <WidgetListGroupItem {...props} />
));

const baseProps = { title: 'List group item', active: false };

export const Simple = createStory(Template, { ...baseProps });

export const Active = createStory(Template, { ...baseProps, active: true });

export const ButtonWidget = createStory(Template, {
  ...baseProps,
  children: <Button size="sm">Button</Button>,
});

export const Link = createStory(Template, {
  ...baseProps,
  action: true,
  href: 'https://www.monashhumanpower.org',
});
