import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './App.css';

import DashboardView from 'views/DashboardView';

function App() {
  return (
    <Router>
      <div>
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
