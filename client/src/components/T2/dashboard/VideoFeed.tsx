// v1.0: WHEP client for pulling a live H.264 feed from a MediaMTX server
// auther: daniel x
// date published: 01/10/2026

import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_PATH = 't2/mock-session-001';

// Max time to wait for ICE candidate gathering before sending the offer anyway (WHEP has no trickle-ICE signalling channel in this simple form, so we wait for gathering to finish rather than trickle candidates).
const ICE_GATHERING_TIMEOUT_MS = 2000;

// How often to retry the WHEP handshake while there's no active publisher yet (e.g. mock publisher hasn't started, or the phone hasn't connected).
const RETRY_INTERVAL_MS = 3000;

type FeedStatus = 'connecting' | 'live' | 'offline' | 'error';

interface VideoFeedProps {
  path?: string;
}

async function waitForIceGatheringComplete(
  pc: RTCPeerConnection,
): Promise<void> {
  if (pc.iceGatheringState === 'complete') return;
  await new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ICE_GATHERING_TIMEOUT_MS);
    pc.addEventListener('icegatheringstatechange', function onChange() {
      if (pc.iceGatheringState === 'complete') {
        clearTimeout(timer);
        pc.removeEventListener('icegatheringstatechange', onChange);
        resolve();
      }
    });
  });
}

export default function VideoFeed({
  path = DEFAULT_PATH,
}: VideoFeedProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<FeedStatus>('connecting');

  useEffect(() => {
    let cancelled = false;
    let pc: RTCPeerConnection | null = null;
    let resourceUrl: string | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const cleanupConnection = () => {
      if (pc) {
        pc.close();
        pc = null;
      }
      if (resourceUrl) {
        fetch(resourceUrl, { method: 'DELETE' }).catch(() => {});
        resourceUrl = null;
      }
    };

    function scheduleRetry() {
      cleanupConnection();
      if (!cancelled) {
        // eslint-disable-next-line no-use-before-define
        retryTimer = setTimeout(connect, RETRY_INTERVAL_MS);
      }
    }

    async function connect() {
      if (cancelled) return;
      setStatus((prev) => (prev === 'live' ? prev : 'connecting'));

      pc = new RTCPeerConnection();
      pc.addTransceiver('video', { direction: 'recvonly' });

      pc.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        }
        setStatus('live');
      };

      pc.oniceconnectionstatechange = () => {
        if (!pc) return;
        if (
          pc.iceConnectionState === 'disconnected' ||
          pc.iceConnectionState === 'failed'
        ) {
          setStatus('offline');
          scheduleRetry();
        }
      };

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await waitForIceGatheringComplete(pc);

        const response = await fetch(`/whep/${path}/whep`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: pc.localDescription?.sdp,
        });

        if (!response.ok) {
          // most commonly a 404 error: no active publisher on this path yet
          throw new Error(`WHEP handshake failed: ${response.status}`);
        }

        const location = response.headers.get('Location');
        resourceUrl = location
          ? new URL(location, response.url).toString()
          : null;

        const answerSdp = await response.text();
        if (cancelled) return;
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      } catch (err) {
        if (!cancelled) {
          setStatus('offline');
          scheduleRetry();
        }
      }
    }

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      cleanupConnection();
    };
  }, [path]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: '#222',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: status === 'live' ? 'block' : 'none',
        }}
      />
      {status !== 'live' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.1rem',
          }}
        >
          {status === 'connecting' && 'Connecting to camera feed…'}
          {status === 'offline' &&
            'Camera feed offline — waiting for publisher…'}
          {status === 'error' && 'Camera feed error'}
        </div>
      )}
    </div>
  );
}
