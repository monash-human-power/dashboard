import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import { BoostResultsT } from 'types/boost';
import BoostResults, {
  BoostResultsProps,
} from 'components/common/boost/BoostResults';

export default {
  title: 'components/common/boost/BoostResults',
  component: BoostResults,
};

const Template = addArgs<BoostResultsProps>((props) => (
  <BoostResults {...props} />
));

const exampleResults: BoostResultsT = {
  fileName: 'example-File-Name',
  maxSpeed: 25,
  zones: [
    {
      power: 20.33,
      distance: 25.1,
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
