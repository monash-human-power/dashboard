import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import NavBar from 'components/NavBar';
import { routes } from 'router';
import './App.css';

function App() {
  const routeItems = routes.map(({ path, exact, component }) => {
    const View = component;
    return (
      <Route exact={exact} path={path} key={path}>
        {View ? <View /> : null}
      </Route>
    );
  });

  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          {routeItems}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
