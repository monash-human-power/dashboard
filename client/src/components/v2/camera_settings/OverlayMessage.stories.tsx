import { action } from '@storybook/addon-actions';
import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import OverlayMessage, { OverlayMessageProps } from 'components/v2/camera_settings/OverlayMessage';

export default {
    component: OverlayMessage,
    title: 'OverlayMessage'
};

const Template = addArgs<OverlayMessageProps>((props) => <OverlayMessage {...props} />);

const sendMessage = action('Send message');

/* ----------------------------------- Stories ----------------------------------- */

export const Message = createStory(Template, { sendMessage });
