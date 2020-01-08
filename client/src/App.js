import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './App.css';

import NavBar from 'components/NavBar';
import DashboardView from 'views/DashboardView';
import DownloadFilesView from 'views/DownloadFilesView';
import SensorStatusView from 'views/SensorStatusView';
import PowerModelView from 'views/PowerModelView';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <DashboardView />
          </Route>
          <Route path="/download-files">
            <DownloadFilesView />
          </Route>
          <Route path="/status">
            <SensorStatusView />
          </Route>
          <Route path="/power-model">
            <PowerModelView />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
