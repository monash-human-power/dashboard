import React from 'react';
import Control from 'react-leaflet-control';

/**
 * Fixed-position legend that persists across pan/zoom (Leaflet v2 + react-leaflet-control)
 * @param {{ bands: Array<{color:string,text:string}>, title?:string, position?: 'topleft'|'topright'|'bottomleft'|'bottomright' }} props
 */
export default function LeafletLegendControl({
  bands,
  title = 'Legend',
  position = 'topright',
}) {
  if (!bands || !bands.length) return null;

  const boxStyle = {
    background: 'rgba(30,30,30,0.80)',
    color: 'white',
    padding: '8px 10px',
    borderRadius: 8,
    fontSize: 12,
    lineHeight: 1.2,
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(2px)',
    maxHeight: 260,
    overflowY: 'auto',
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '3px 0',
  };
  const swatch = (c) => ({
    width: 16,
    height: 8,
    borderRadius: 2,
    display: 'inline-block',
    background: c,
  });

  return (
    <Control position={position}>
      <div style={boxStyle}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
        {bands.map((b) => (
          <div key={`${b.color}-${b.text}`} style={rowStyle}>
            <span style={swatch(b.color)} />
            <span>{b.text}</span>
          </div>
        ))}
      </div>
    </Control>
  );
}
