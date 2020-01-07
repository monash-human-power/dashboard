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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
