import React from 'react';
import { bikeVersions } from 'router';
import { routes } from 'router/v2';
import NavBar from './NavBar';


export default {
    component: NavBar,
    title: 'NavBar'
};

const Template = args => <NavBar {...{...args, bikeVersions}} />;

export const V2 = Template.bind({});
V2.args = {
    bikeVersion: {
      name: 'Version 2 (Wombat)',
      rootPath: '/v2',
      routes,
    }
};

export const V3 = Template.bind({});
V3.args = {
    bikeVersion: {
      name: 'Version 3 (V3)',
      rootPath: '/v3',
      routes: [],
    }
};
