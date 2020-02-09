import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

/**
 * @typedef {object} ContentPageProps
 * @property {string}           title     Page Title
 * @property {React.ReactNode}  children  Children
 */

export default function ContentPage({ title, children }) {
  return (
    <Container className="mb-4 mt-4">
      <h1 className="mb-4">{title}</h1>
      {children}
    </Container>
  );
}

ContentPage.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ContentPage.defaultProps = {
  title: '',
};
