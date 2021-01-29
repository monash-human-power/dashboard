import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import OnlineStatusPill, { OnlineStatusPillProps } from 'components/common/OnlineStatusPill';

export default {
    component: OnlineStatusPill,
    title: 'components/common/OnlineStatusPill'
};

// Stories Template
const Template = addArgs<OnlineStatusPillProps>(
    props => <OnlineStatusPill {...props} />
);

// Stories
export const Connected = createStory(Template, { isOnline: true });
export const Offline = createStory(Template, { isOnline: false });
export const Null = createStory(Template, { isOnline: null });
