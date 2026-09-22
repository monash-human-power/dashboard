import React from 'react';
import { render } from '@testing-library/react';
import SessionMap from './SessionMap';

test('cancels wheel zoom when switching away from a map', () => {
  jest.useFakeTimers();
  const view = render(
    <SessionMap center={[-38, 145]} zoom={16}>
      {null}
    </SessionMap>,
  );
  const container = view.container.querySelector('.leaflet-container')!;
  container.dispatchEvent(
    new WheelEvent('wheel', { deltaY: -120, bubbles: true }),
  );
  view.unmount();
  expect(() => jest.runOnlyPendingTimers()).not.toThrow();
  jest.useRealTimers();
});
