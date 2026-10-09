import { useEffect, useState } from 'react';
import { Runtype, Static } from 'runtypes';
import io from 'socket.io-client';

const socket = io();

/**
 * Transmit payload to channel
 *
 * @param channel Channel to transmit to
 * @param payload Payload to send
 */
export function emit(channel: string, payload?: any) {
  socket.emit(channel, payload);
}

/**
 * Listen to channel
 *
 * @param channel   Channel to listen to
 * @param callback  Callback on message
 */
export function useChannel(channel: string, callback: Function) {
  useEffect(() => {
    socket.on(channel, callback);

    return () => {
      socket.off(channel, callback);
    };
  }, [channel, callback]);
}

/**
 * Listen to channel with shape of response enforced
 *
 * @param channel   Channel to listen to
 * @param shape     Shape of response payload
 * @param callback  Callback on message
 */
export function useChannelShaped<T>(
  channel: string,
  shape: Runtype<T>,
  callback: (payload: Static<typeof shape>) => void,
) {
  const parsedCallback = (payload: string | object) => {
    const json = typeof payload === 'string' ? JSON.parse(payload) : payload;
    try {
      callback(shape.check(json));
    } catch {
      console.log(`Channel ${channel} sending garbage`);
    }
  };
  useChannel(channel, parsedCallback);
}

/** Current dashboard-to-backend connection; pit actions need this connection. */
export function useSocketConnected() {
  const [connected, setConnected] = useState(!!socket.connected);
  useEffect(() => {
    const online = () => setConnected(true);
    const offline = () => setConnected(false);
    socket.on('connect', online);
    socket.on('disconnect', offline);
    return () => {
      socket.off('connect', online);
      socket.off('disconnect', offline);
    };
  }, []);
  return connected;
}
