import { useEffect } from 'react';
import io from 'socket.io-client';

let socket;
/**
 * Get socket.io connection
 *
 * @returns {Socket} Socket.io socket
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
 * @param {string} channel Channel to transmit to
 * @param {object} payload Payload to send
 */
export function emit(channel, payload) {
  getSocket().emit(channel, payload);
}

/**
 * Listen to channel
 *
 * @param {string}    channel   Channel to listen to
 * @param {Function}  callback  Callback on message
 */
export function useChannel(channel, callback) {
  useEffect(() => {
    const localSocket = getSocket();
    localSocket.on(channel, callback);

    return () => {
      localSocket.off(channel, callback);
    };
  }, [channel, callback]);
}
