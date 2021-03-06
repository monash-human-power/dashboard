import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { routes } from 'router';
import NavBarContainer from 'components/common/navbar/NavBarContainer';
import styles from './App.module.css';

/**
 * Main App component
 *
 * @returns {React.Component} Component
 */
function App() {
  const routeItems = routes.map(({ path, exact, component }) => {
    const View = component;
    console.log('hi');
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
