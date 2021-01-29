import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import { BrowserRouter as Router } from "react-router-dom";
import { bikeVersions } from 'router';
import V2routes from 'router/v2';
import V3routes from 'router/v3';
import NavBar, { NavBarProps } from 'components/common/navbar/NavBar';


export default {
  title: 'components/common/navbar/NavBar',
  component: NavBar
};

const Template = addArgs<NavBarProps>(
  props => <Router><NavBar {...props} /></Router>
);

const baseProps = { bikeVersions: bikeVersions };

export const V2 = createStory(Template, {
  ...baseProps,
  bikeVersion: {
    name: 'Version 2 (Wombat)',
    rootPath: '/v2',
    routes: V2routes
  }
});

export const V3 = createStory(Template, {
  ...baseProps,
  bikeVersion: {
    name: 'Version 3 (V3)',
    rootPath: '/v3',
    routes: V3routes
  }
});
