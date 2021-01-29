import { action } from '@storybook/addon-actions';
import React from 'react';
import { addArgs, createStory } from '../../utils/stories';
import OverlaySelection, { OverlaySelectionProps } from './OverlaySelection';

export default {
    component: OverlaySelection,
    title: 'OverlaySelection'
};

const Template = addArgs<OverlaySelectionProps>((props) => <OverlaySelection {...props} />);

const baseProps = {
    device: 'primary' as 'primary', // For literal type, can use Device when that gets merged
    setActiveOverlay: action('set')
};

/* ----------------------------------- Stories ----------------------------------- */

export const Waiting = createStory(Template, {
    ...baseProps,
    overlays: null
});

export const One = createStory(Template, {
    ...baseProps,
    overlays: {
        active: 'overlay_1.py',
        overlays: ['overlay_1.py']
    }
});

export const Many = createStory(Template, {
    ...baseProps,
    overlays: {
        active: 'overlay_1.py',
        overlays: ['overlay_1.py', 'overlay_2.py', 'overlay_3.py']
    }
});
