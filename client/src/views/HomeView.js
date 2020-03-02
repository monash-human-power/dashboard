import React from 'react';
import { Redirect } from 'react-router-dom';

/**
 * Home view component
 *
 * @returns {React.Component} Component
 */
export default function HomeView() {
  return <Redirect to="/v3" />;
}
