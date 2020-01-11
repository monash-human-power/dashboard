import { useState, useCallback } from 'react';
import { useChannel } from '../socket';

export function useData() {
  const [data, setData] = useState(null);

  const handler = useCallback((newData) => {
    setData(newData);
  }, []);
  useChannel('data', handler);

  return data;
}
