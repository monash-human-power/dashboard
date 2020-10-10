import { storiesOf } from "@storybook/react";
import React from 'react';
import { bikeVersions, VersionInfo } from 'router';
import { routes } from 'router/v2';
import NavBar from './NavBar';


export default {
  component: NavBar,
  title: 'NavBar'
};

const template = (arg: VersionInfo) =>
  () => <NavBar bikeVersion={arg} bikeVersions={bikeVersions} />;

storiesOf("NavBar", module)
  .add("V2", template({
    name: 'Version 2 (Wombat)',
    rootPath: '/v2',
    routes,
  }))
  .add("V3", template({
    name: 'Version 3 (V3)',
    rootPath: '/v3',
    routes: [],
  }));
