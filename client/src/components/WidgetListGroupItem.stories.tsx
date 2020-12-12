import React from 'react';
import { Button } from 'react-bootstrap';
import WidgetListGroupItem, {
  WidgetListGroupItemProps,
} from './WidgetListGroupItem';
import { storiesOf } from '@storybook/react';

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

storiesOf('WidgetListGroupItem', module)
  .add('Simple', template({ ...baseProps }))
  .add('Active', template({ ...baseProps, active: true }))
  .add(
    'ButtonWidget',
    template({ ...baseProps, children: <Button size="sm">Button</Button> }),
  )
  .add('Link', template({ ...baseProps, action: true, href: 'javascript:;' }));
