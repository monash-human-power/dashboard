import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import CameraStatus, {
  CameraStatusProps,
} from 'components/common/camera_settings/CameraStatus';

export default {
  component: CameraStatus,
  title: 'components/common/camera_settings/CameraStatus',
};

const Template = addArgs<CameraStatusProps>((props) => (
  <CameraStatus {...props} />
));

/* ----------------------------------- Stories ----------------------------------- */

export const Off = createStory(Template, {
  primaryStatus: false,
  secondaryStatus: false,
});

export const On = createStory(Template, {
  primaryStatus: true,
  secondaryStatus: true,
});

export const PrimaryOn = createStory(Template, {
  primaryStatus: true,
  secondaryStatus: false,
});

export const SecondaryOn = createStory(Template, {
  primaryStatus: false,
  secondaryStatus: true,
});
