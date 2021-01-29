import { storiesOf } from "@storybook/react";
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { bikeVersions, VersionInfo } from 'router';
import { routes } from 'router/v2';
import NavBar from 'components/common/navbar/NavBar';


export default {
  title: 'components/common/navbar/NavBar',
  component: NavBar
};

const template = (arg: VersionInfo) =>
  () => <Router><NavBar bikeVersion={arg} bikeVersions={bikeVersions} /></Router>;

storiesOf("NavBar", module)
  .add("V2", template({
    name: 'Version 2 (Wombat)',
    rootPath: '/v2',
    routes,
  }))
  .add("V3", template({
    name: 'Version 3 (Priscilla)',
    rootPath: '/v3',
    routes: [],
  }));
