import { storiesOf } from "@storybook/react";
import React from 'react';
import StatusPill, { PillProps } from 'components/common/StatusPill';

export default {
    component: StatusPill,
    title: 'StatusTOOOll'
};

const template = (arg: PillProps) =>
    () => <StatusPill isConnected={arg.isConnected} />;

storiesOf("Status Pill", module)
    .add("Connected", template({ isConnected: true }))
    .add("Disconnected", template({ isConnected: false }))
    .add("Null", template({ isConnected: null }));
