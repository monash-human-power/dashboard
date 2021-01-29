import { action } from '@storybook/addon-actions';
import React from 'react';
import { Device } from 'types/camera';
import { addArgs, createStory } from 'utils/stories';
import OverlaySelection, { OverlaySelectionProps } from 'components/v2/camera_settings/OverlaySelection';

export default {
    component: OverlaySelection,
    title: 'components/v2/camera_settings/OverlaySelection'
};

const Template = addArgs<OverlaySelectionProps>((props) => <OverlaySelection {...props} />);

const baseProps = {
    device: 'primary' as Device,
    setActiveOverlay: action('set')
};

const baseConfig = {
    device: 'primary' as Device,
    bike: 'Priscilla',
    overlays: ['overlay_1.py', 'overlay_2.py']
};

/* ----------------------------------- Stories ----------------------------------- */

export const Waiting = createStory(Template, {
    ...baseProps,
    config: null
});

export const One = createStory(Template, {
    ...baseProps,
    config: {
        ...baseConfig,
        activeOverlay: 'overlay_1.py',
        overlays: ['overlay_1.py']
    }
});

export const Many = createStory(Template, {
    ...baseProps,
    config: {
        ...baseConfig,
        activeOverlay: 'overlay_1.py',
        overlays: ['overlay_1.py', 'overlay_2.py', 'overlay_3.py']
    }
});
