import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import NavBar, { NavBarProps } from 'components/common/navbar/NavBar';
import { bikeVersions } from 'router';
import { routes } from 'router/v2';
import { addArgs, createStory } from 'utils/stories';

export default {
  title: 'components/common/navbar/NavBar',
  component: NavBar,
};

const Template = addArgs<NavBarProps>((props) => (
  <Router>
    <NavBar {...props} />
  </Router>
));

const baseProps = { bikeVersions };

export const V2 = createStory(Template, {
  ...baseProps,
  bikeVersion: {
    name: 'Version 2 (Wombat)',
    rootPath: '/v2',
    routes,
  },
});

export const V3 = createStory(Template, {
  ...baseProps,
  bikeVersion: {
    name: 'Version 2 (Wombat)',
    rootPath: '/v2',
    routes,
  },
});
