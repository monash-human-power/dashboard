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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
