import React from 'react';
import { render, act } from '@testing-library/react';
import PitControl from './PitControl';

const { fireEvent, waitForElement } = require('@testing-library/react');
const mockChannels: { [key: string]: Function } = {};
let mockHistory: any = { session: null, records: [{ sessionId: 'ride' }] };
let mockOnline = true;
jest.mock('api/common/socket', () => ({
  useSocketConnected: () => mockOnline,
  useChannel: (channel: string, callback: Function) => {
    mockChannels[channel] = callback;
  },
}));
jest.mock('../SessionHistory', () => ({
  useSessionHistory: () => mockHistory,
}));
const initial = {
  sessionId: 'ride',
  state: 'idle',
  version: 0,
  requestedBy: null,
  acknowledgedAt: null,
};

test('crew request, rider acknowledgement, cancellation and completion stay synchronized, and history is read only', async () => {
  const originalFetch = window.fetch;
  let status: any = initial;
  window.fetch = jest.fn(async (_url, options) => {
    if (options && options.method === 'POST') {
      const command = JSON.parse(options.body as string);
      const states: any = {
        request: 'preparing',
        cancel: 'cancelled',
        start: 'pitting',
        complete: 'completed',
      };
      status = {
        ...status,
        state: states[command.action],
        version: status.version + 1,
      };
      return {
        ok: true,
        json: async () => ({ ...status, mqttConnected: true }),
      };
    }
    return {
      ok: true,
      json: async () => ({ pitStatus: status, mqttConnected: true }),
    };
  }) as any;
  const view = render(<PitControl />);
  await waitForElement(() => view.getByText('Pit: No request'));
  fireEvent.click(view.getByText('Request pit'));
  await waitForElement(() => view.getByText('Cancel request'));
  expect(view.container.textContent).toContain(
    'Awaiting rider acknowledgement',
  );
  act(() =>
    mockChannels['t2-pit-state']({
      ...status,
      version: 2,
      acknowledgedAt: '2026-10-09T00:00:00Z',
    }),
  );
  expect(view.container.textContent).toContain('Rider acknowledged');
  act(() =>
    mockChannels['t2-pit-state']({ ...status, state: 'cancelled', version: 3 }),
  );
  expect(view.container.textContent).toContain('Pit: Request cancelled');
  fireEvent.click(view.getByText('Request pit'));
  // The test server increments from its own stored status; newer socket versions win.
  status = { ...status, version: 4, state: 'preparing' };
  act(() => mockChannels['t2-pit-state'](status));
  await waitForElement(() => view.getByText('Start pit'));
  fireEvent.click(view.getByText('Start pit'));
  await waitForElement(() => view.getByText('Pit complete'));
  fireEvent.click(view.getByText('Pit complete'));
  await waitForElement(() => view.getByText('Pit: Pit completed'));
  act(() => mockChannels['t2-pit-connection']({ connected: false }));
  expect((view.getByText('Request pit') as HTMLButtonElement).disabled).toBe(
    true,
  );
  mockHistory = {
    session: 'ride',
    records: [],
    savedPit: { ...initial, state: 'preparing', version: 1 },
  };
  view.rerender(<PitControl />);
  expect(view.container.textContent).toContain('Saved history');
  expect((view.getByText('Start pit') as HTMLButtonElement).disabled).toBe(
    true,
  );
  const previousText = view.container.textContent;
  act(() =>
    mockChannels['t2-pit-state']({ ...initial, state: 'pitting', version: 99 }),
  );
  expect(view.container.textContent).toBe(previousText);
  view.unmount();
  window.fetch = originalFetch;
  mockHistory = { session: null, records: [{ sessionId: 'ride' }] };
});
