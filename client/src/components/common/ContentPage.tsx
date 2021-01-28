import React from 'react';
import { Container } from 'react-bootstrap';

interface ContentPageProps {
  /** Title of page */
  title: string,
  /** React children to be passed through */
  children: React.ReactNode,
}

/**
 * Content Page container component
 *
 * @param {ContentPageProps} props Props
 * @returns {React.Component<ContentPageProps>} Component
 */
export default function ContentPage({ title, children }: ContentPageProps): JSX.Element {
  return (
    <Container className="mb-4 mt-4">
      <h1 className="mb-4">{title}</h1>
      {children}
    </Container>
  );
}

ContentPage.defaultProps = {
  title: '',
};
