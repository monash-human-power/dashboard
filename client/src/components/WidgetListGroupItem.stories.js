import React from 'react';
import { Button } from 'react-bootstrap';
import WidgetListGroupItem from './WidgetListGroupItem';

export default {
  title: 'WidgetListGroupItem',
  component: WidgetListGroupItem,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

const Template = (args) => <WidgetListGroupItem {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  key: 'unique_id',
  title: 'List group item',
};

export const ButtonWidget = Template.bind({});
ButtonWidget.args = {
  ...Simple.args,
  children: <Button size="sm">Button</Button>,
  target: '_blank',
};

export const Link = Template.bind({});
Link.args = {
  ...Simple.args,
  action: true,
  href: 'https://www.monashhumanpower.org',
};
