import { useEffect } from 'react';
import io from 'socket.io-client';

let socket: SocketIOClient.Socket;
/**
 * Get socket.io connection
 *
 * @returns Socket.io socket
 */
export function getSocket() {
  if (!socket) {
    socket = io();
  }
  return socket;
}

/**
 * Transmit payload to channel
 *
 * @param channel Channel to transmit to
 * @param payload Payload to send
 */
// TODO: We shouldn't be able to send just a number, we should enforce objects are sent.
// Once V2 BOOST API is phased out, this should be possible.
export function emit(channel: string, payload?: object | number) {
  getSocket().emit(channel, payload);
}

/**
 * Listen to channel
 *
 * @param channel   Channel to listen to
 * @param callback  Callback on message
 */
export function useChannel(channel: string, callback: Function) {
  useEffect(() => {
    const localSocket = getSocket();
    localSocket.on(channel, callback);

    return () => {
      localSocket.off(channel, callback);
    };
  }, [channel, callback]);
}
