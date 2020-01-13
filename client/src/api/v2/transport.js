import { useEffect } from 'react';
import path from 'path';
import io from 'socket.io-client';
import { Observable, useObservable } from 'utils/observable';

/**
 * @typedef {import('socket.io-client').SocketIOClient.Socket} Socket
 */

const apiServer = new Observable('');

/**
 * Switch to a different API server
 *
 * @param {string} newServer New API server URL
 */
export function setApiServer(newServer) {
  apiServer.next(newServer);
}

/**
 * Create a Socket.io socket
 *
 * @param {string} server API server address
 * @returns {Socket} Socket.io socket
 */
function createSocket(server) {
  return io(path.join(server, '/'));
}
const socket = new Observable(createSocket(apiServer.get()));

apiServer.subscribe((newServer) => {
  socket.get().close();
  socket.next(createSocket(newServer));
});

/**
 * Transmit payload to channel
 *
 * @param {string} channel Channel to transmit to
 * @param {object} payload Payload to send
 */
export function emit(channel, payload) {
  socket.get().emit(channel, payload);
}

/**
 * Listen to channel
 *
 * @param {string}    channel   Channel to listen to
 * @param {Function}  callback  Callback on message
 */
export function useChannel(channel, callback) {
  const localSocket = useObservable(socket);

  useEffect(() => {
    localSocket.on(channel, callback);

    return () => {
      localSocket.off(channel, callback);
    };
  }, [localSocket, channel, callback]);
}

/**
 * @typedef {import('typescript/lib/lib.dom.ts').RequestInit} RequestInit
 */

/**
 * Perform a fetch to an API endpoint
 *
 * @param {string}      endpoint API endpoint
 * @param {RequestInit} options  Fetch options
 */
export async function apiFetch(endpoint, options) {
  return fetch(path.join(apiServer.get(), endpoint), options);
}
