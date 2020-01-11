import React from 'react';
import { Container } from 'react-bootstrap';
import CadenceTimeChart from 'components/v2/charts/CadenceTimeChart';

export default function DashboardView() {
  const updateInterval = 1000;

  return (
    <Container>
      <CadenceTimeChart interval={updateInterval} />
    </Container>
  );
}
