import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { routes } from 'router';
import styles from './App.module.css';
import NavBarContainer from './components/NavBarContainer';

/**
 * Main App component
 *
 * @returns {React.Component} Component
 */
function App() {
  const routeItems = routes.map(({ path, exact, component }) => {
    const View = component;
    return (
      <Route exact={exact} path={path} key={path}>
        <div className={styles.view}>{View ? <View /> : null}</div>
      </Route>
    );
  });

  return (
    <Router>
      <div className={styles.app}>
        <NavBarContainer />
        <Switch>{routeItems}</Switch>
      </div>
    </Router>
  );
}

export default App;
