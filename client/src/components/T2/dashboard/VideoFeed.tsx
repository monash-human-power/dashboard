import React from 'react';

export default function VideoFeed(): JSX.Element {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: '#222',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
      }}
    >
      Video feed — H.264 decoding not yet implemented
    </div>
  );
}
