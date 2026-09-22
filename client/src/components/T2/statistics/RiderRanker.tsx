import React, { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useChannel } from 'api/common/socket';
import { useLapContext } from 'components/T2/LapContext';
import styles from './RiderRanker.module.css';

interface TelemetryPayload {
  type: string;
  timestamp: string;
  sessionId: string;
  data: {
    speed: { value: number; unit: string };
    cadence: { value: number; unit: string };
    power: { value: number; unit: string };
    batteryVoltage: { value: number; unit: string };
    gps: {
      latitude: number;
      longitude: number;
      altitude: number;
      speed: number;
    };
  };
}

interface PopupState {
  label: string;
  top: number;
  left: number;
}

interface Analytics {
  sampleCount: number;
  currentSpeed: number;
  currentPower: number;
  currentCadence: number;
  currentBattery: number;
  avgSpeed: number;
  avgPower: number;
  avgCadence: number;
  maxSpeed: number;
  maxPower: number;
}

const INITIAL_ANALYTICS: Analytics = {
  sampleCount: 0,
  currentSpeed: 0,
  currentPower: 0,
  currentCadence: 0,
  currentBattery: 0,
  avgSpeed: 0,
  avgPower: 0,
  avgCadence: 0,
  maxSpeed: 0,
  maxPower: 0,
};

export default function RiderAnalytics(): JSX.Element {
  const [analytics, setAnalytics] = useState<Analytics>(INITIAL_ANALYTICS);
  const {
    lapCount,
    lastSegment,
    segmentHistory,
    currentSegmentElapsedSec,
    currentLapElapsedSec,
  } = useLapContext();

  const [popup, setPopup] = useState<PopupState | null>(null);

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => setPopup(null), 150);
  }, []);

  const handleRowEnter = useCallback(
    (label: string, event: React.MouseEvent<HTMLDivElement>) => {
      cancelClose();
      const rect = event.currentTarget.getBoundingClientRect();
      const POPUP_HEIGHT_ESTIMATE = 200;
      const top =
        rect.top + POPUP_HEIGHT_ESTIMATE > window.innerHeight
          ? window.innerHeight - POPUP_HEIGHT_ESTIMATE - 10
          : rect.top;
      setPopup({ label, top, left: rect.right + 10 });
    },
    [cancelClose],
  );

  const handleRowLeave = useCallback(() => {
    setPopup(null);
  }, []);

  const handleMessage = useCallback((payload: string | TelemetryPayload) => {
    const parsed: TelemetryPayload =
      typeof payload === 'string' ? JSON.parse(payload) : payload;
    const { speed, power, cadence, batteryVoltage, gps } = parsed.data;

    setAnalytics((prev) => {
      const n = prev.sampleCount + 1;
      return {
        sampleCount: n,
        currentSpeed: speed.value,
        currentPower: power.value,
        currentCadence: cadence.value,
        currentBattery: batteryVoltage.value,
        avgSpeed: (prev.avgSpeed * prev.sampleCount + speed.value) / n,
        avgPower: (prev.avgPower * prev.sampleCount + power.value) / n,
        avgCadence: (prev.avgCadence * prev.sampleCount + cadence.value) / n,
        maxSpeed: Math.max(prev.maxSpeed, speed.value),
        maxPower: Math.max(prev.maxPower, power.value),
      };
    });
  }, []);

  useChannel('t2-telemetry', handleMessage);

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>Live Telemetry</div>
      <div className={styles.statGrid}>
        <div className={styles.statBox}>
          <div className={styles.statValue}>
            {analytics.currentSpeed.toFixed(1)}
            <span className={styles.statUnit}>km/h</span>
          </div>
          <div className={styles.statLabel}>Speed</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>
            {analytics.currentPower.toFixed(0)}
            <span className={styles.statUnit}>W</span>
          </div>
          <div className={styles.statLabel}>Power</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>
            {analytics.currentCadence.toFixed(0)}
            <span className={styles.statUnit}>rpm</span>
          </div>
          <div className={styles.statLabel}>Cadence</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>
            {analytics.currentBattery.toFixed(1)}
            <span className={styles.statUnit}>V</span>
          </div>
          <div className={styles.statLabel}>Battery</div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Session Averages</div>
      <div className={styles.statGrid}>
        <div className={styles.statBox}>
          <div className={styles.statValue}>
            {analytics.avgSpeed.toFixed(1)}
            <span className={styles.statUnit}>km/h</span>
          </div>
          <div className={styles.statLabel}>Avg Speed</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>
            {analytics.avgPower.toFixed(0)}
            <span className={styles.statUnit}>W</span>
          </div>
          <div className={styles.statLabel}>Avg Power</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>
            {analytics.avgCadence.toFixed(0)}
            <span className={styles.statUnit}>rpm</span>
          </div>
          <div className={styles.statLabel}>Avg Cadence</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>{analytics.sampleCount}</div>
          <div className={styles.statLabel}>Samples</div>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.lapSummaryRow}>
        <span className={styles.sectionTitle} style={{ margin: 0 }}>
          Lap & Segment Timing
        </span>
        <span className={styles.lapCount}>{lapCount} laps</span>
      </div>

      <div className={styles.currentSegment}>
        <div className={styles.currentSegmentHalf}>
          <span>Current segment</span>
          <span className={styles.currentSegmentTime}>
            {currentSegmentElapsedSec.toFixed(1)}s
          </span>
        </div>
        <div className={styles.currentSegmentDivider} />
        <div className={styles.currentSegmentHalf}>
          <span>Current lap</span>
          <span className={styles.currentSegmentTime}>
            {currentLapElapsedSec.toFixed(1)}s
          </span>
        </div>
      </div>

      {lastSegment && (
        <div className={styles.segmentRow} style={{ marginBottom: 12 }}>
          <span className={styles.segmentName}>Last: {lastSegment.label}</span>
          <span className={styles.segmentStats}>
            {lastSegment.durationSec.toFixed(1)}s
          </span>
        </div>
      )}

      {Object.keys(segmentHistory).length === 0 ? (
        <div className={styles.emptyState}>
          No segments recorded yet — click the map to set a start point.
        </div>
      ) : (
        <div className={styles.segmentList}>
          {Object.entries(segmentHistory)
            .sort(([labelA], [labelB]) => {
              // "Full Lap" always first
              if (labelA === 'Full Lap') return -1;
              if (labelB === 'Full Lap') return 1;
              // Otherwise sort segments numerically: "Segment 1", "Segment 2", ...
              const numA = parseInt(labelA.replace('Segment ', ''), 10);
              const numB = parseInt(labelB.replace('Segment ', ''), 10);
              return numA - numB;
            })
            .map(([label, timings]) => {
              const avg =
                timings.reduce((a, t) => a + t.durationSec, 0) / timings.length;
              return (
                <div
                  key={label}
                  className={styles.segmentRow}
                  onMouseEnter={(e) => handleRowEnter(label, e)}
                  onMouseLeave={scheduleClose}
                >
                  <span className={styles.segmentName}>{label}</span>
                  <span className={styles.segmentStats}>
                    avg {avg.toFixed(1)}s ({timings.length} laps)
                  </span>
                </div>
              );
            })}
        </div>
      )}

      {popup &&
        createPortal(
          <div
            className={styles.segmentPopup}
            style={{ top: popup.top, left: popup.left }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className={styles.segmentPopupTitle}>
              {popup.label} — all times
            </div>
            {[...(segmentHistory[popup.label] ?? [])]
              .sort((a, b) => a.lapNumber - b.lapNumber)
              .map((t) => (
                <div key={t.lapNumber} className={styles.segmentPopupRow}>
                  <span>Lap {t.lapNumber}</span>
                  <span>{t.durationSec.toFixed(1)}s</span>
                </div>
              ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
