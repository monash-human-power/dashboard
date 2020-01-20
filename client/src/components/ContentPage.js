import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

/**
 * @typedef {object} ContentPageProps
 * @property {string}           title     Page Title
 * @property {React.ReactNode}  children  Children
 */

/**
 * Content Page container component
 *
 * @param {ContentPageProps} props Props
 * @returns {React.Component<ContentPageProps>} Component
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
  children: PropTypes.element.isRequired,
};

ContentPage.defaultProps = {
  title: '',
};
