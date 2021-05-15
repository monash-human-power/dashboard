import { useEffect, useState } from 'react';
import { Runtype } from 'runtypes';
import { emit, useChannelShaped } from './socket';

/**
 * Create hooks for getting payloads
 *
 * @param path Path to payload
 * @param shape RunType shape of payload
 * @param retained Is the payload retained
 * @returns Hook for getting a payload
 */
export function usePayload<T>(
  path: string,
  shape: Runtype<T>,
  retained: boolean = true,
) {
  // Only run init once per render
  useEffect(() => {
    if (retained) emit(path);
  }, [retained, path]);

  const [payload, setPayload] = useState<T | null>(null);
  useChannelShaped(path, shape, (data) => setPayload(data));

  return payload;
}
