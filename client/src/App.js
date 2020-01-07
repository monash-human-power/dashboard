import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './App.css';

import NavBar from 'components/NavBar';
import DashboardView from 'views/DashboardView';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <DashboardView />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
