import { useEffect } from 'react';
import io from 'socket.io-client';

let socket;
export default function getSocket() {
  if (!socket) {
    socket = io();
  }
  return socket;
}

export function emit(channel, payload) {
  getSocket().emit(channel, payload);
}

export function useChannel(channel, callback) {
  useEffect(() => {
    const localSocket = getSocket();
    localSocket.on(channel, callback);

    return () => {
      localSocket.off(channel, callback);
    };
  }, [channel, callback]);
}
