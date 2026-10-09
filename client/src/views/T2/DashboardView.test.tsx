import React from 'react';
import { render } from '@testing-library/react';
import DashboardView from './DashboardView';

const { fireEvent } = require('@testing-library/react');
let mockMapMounts = 0;
jest.mock('components/T2/dashboard/AnimatedLocationMap', () => {
  const ReactModule = require('react');
  return () => {
    ReactModule.useEffect(() => {
      mockMapMounts += 1;
    }, []);
    return <div>Existing map trail</div>;
  };
});
jest.mock('components/T2/SessionHistory', () => ({
  SessionHistoryProvider: ({ children }: any) => children,
  useSessionHistory: () => ({ session: null, revision: 0 }),
}));
jest.mock('components/T2/LapContext', () => ({
  LapProvider: ({ children }: any) => children,
}));
jest.mock('components/T2/dashboard/PitControl', () => () => (
  <button>Request pit</button>
));
jest.mock('components/T2/dashboard/VideoFeed', () => () => <div>Camera</div>);
jest.mock('components/T2/dashboard/DataDisplay', () => () => (
  <div>Session details content</div>
));
jest.mock('components/T2/dashboard/SavedSessions', () => () => (
  <button>Saved sessions</button>
));
jest.mock('components/T2/statistics/RiderRanker', () => () => (
  <div>Telemetry</div>
));
jest.mock('components/T2/statistics/RiderRankings', () => () => (
  <div>Rankings</div>
));

test('expanding and closing the map preserves its mounted instance and leaves pit controls accessible', () => {
  const view = render(<DashboardView />);
  fireEvent.click(view.getByText('Expand map'));
  expect(view.getByText('Request pit')).toBeTruthy();
  expect(view.getByText('Existing map trail')).toBeTruthy();
  expect(mockMapMounts).toBe(1);
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(view.getByText('Expand map')).toBeTruthy();
  expect(mockMapMounts).toBe(1);
  expect(document.body.style.overflow).toBe('');
  view.unmount();
});
