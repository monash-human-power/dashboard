import { useEffect } from 'react';
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
    callback(shape.check(json));
  };
  useChannel(channel, parsedCallback);
}
