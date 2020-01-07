import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;
export default function getSocket() {
  if (!socket) {
    socket = io();
  }
  return socket;
}

export function useData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    function dataHandler(newData) {
      setData(newData);
    }

    const localSocket = getSocket();
    localSocket.on('data', dataHandler);

    return () => {
      localSocket.off('data', dataHandler);
    };
  }, []);

  return data;
}
