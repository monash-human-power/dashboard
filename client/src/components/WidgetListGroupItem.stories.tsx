import React from 'react';
import { Button } from 'react-bootstrap';
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

const template = (args: WidgetListGroupItemProps) => () => (
  <WidgetListGroupItem {...args} />
);

const baseProps = { title: 'List group item', active: false };

export const Simple = template({ ...baseProps });

export const Active = template({ ...baseProps, active: true });

export const ButtonWidget = template({
  ...baseProps,
  children: <Button size="sm">Button</Button>,
});

export const Link = template({
  ...baseProps,
  action: true,
  href: 'https://www.monashhumanpower.org',
});
