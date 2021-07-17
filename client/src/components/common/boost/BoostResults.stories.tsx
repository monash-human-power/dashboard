import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import { BoostResultT } from 'types/boost';
import BoostResults, {
  BoostResultProps,
} from 'components/common/boost/BoostResults';

export default {
  title: 'components/common/boost/BoostResults',
  component: BoostResults,
};

const Template = addArgs<BoostResultProps>((props) => (
  <BoostResults {...props} />
));

const exampleResults: BoostResultT = {
  fileName: 'example-File-Name',
  maxSpeed: 25,
  zones: [
    {
      power: 20,
      distance: 25,
    },
    {
      power: 30,
      distance: 40,
    },
  ],
};

export const Simple = createStory(Template, {
  results: exampleResults,
});

export const NoPlan = createStory(Template, {
  results: null,
});
