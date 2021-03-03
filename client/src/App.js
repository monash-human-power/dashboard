import React from 'react';
import { Toaster } from 'react-hot-toast';
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
    return (
      <Route exact={exact} path={path} key={path}>
        <div className={styles.view}>{View ? <View /> : null}</div>
      </Route>
    );
  });

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} duration="10000" />
      <Router>
        <div className={styles.app}>
          <NavBarContainer />
          <Switch>{routeItems}</Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
