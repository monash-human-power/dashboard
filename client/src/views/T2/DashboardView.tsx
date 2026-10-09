import React, { useEffect, useRef, useState } from 'react';
import PitControl from 'components/T2/dashboard/PitControl';
import AnimatedLocationMap from 'components/T2/dashboard/AnimatedLocationMap';
import VideoFeed from 'components/T2/dashboard/VideoFeed';
import DataDisplay from 'components/T2/dashboard/DataDisplay';
import SavedSessions from 'components/T2/dashboard/SavedSessions';
import RiderRankings from 'components/T2/statistics/RiderRankings';
import RiderAnalytics from 'components/T2/statistics/RiderRanker';
import { LapProvider } from 'components/T2/LapContext';
import {
  SessionHistoryProvider,
  useSessionHistory,
} from 'components/T2/SessionHistory';
import styles from './DashboardView.module.css';

function DashboardContent(): JSX.Element {
  const { session, revision } = useSessionHistory();
  const [expanded, setExpanded] = useState(false);
  const toolbar = useRef<HTMLDivElement>(null);
  const [toolbarHeight, setToolbarHeight] = useState(76);
  useEffect(() => {
    if (!expanded) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', escape);
    const measure = () => {
      if (toolbar.current)
        setToolbarHeight(toolbar.current.getBoundingClientRect().height);
    };
    measure();
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(measure)
        : null;
    if (observer && toolbar.current) observer.observe(toolbar.current);
    window.dispatchEvent(new Event('resize'));
    return () => {
      if (observer) observer.disconnect();
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', escape);
    };
  }, [expanded]);
  return (
    <LapProvider key={`${session || 'live'}-${revision}`}>
      <main className={styles.dashboard}>
        <div
          ref={toolbar}
          className={`${styles.heading} ${
            expanded ? styles.expandedHeading : ''
          }`}
        >
          <h1>T2 Session Dashboard</h1>
          <PitControl />
          <SavedSessions />
        </div>
        <div className={styles.overview}>
          <div className={`${styles.column} ${styles.mapColumn}`}>
            <section
              className={`${styles.mapCard} ${
                expanded ? styles.expandedMap : ''
              }`}
              style={expanded ? { top: toolbarHeight + 12 } : undefined}
              aria-label="Track map"
            >
              <div className={styles.cardHeader}>
                <div>
                  <h2>Track & checkpoints</h2>
                  <p>
                    Yellow starts the lap. Add purple points in riding order.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.expandButton}
                  aria-expanded={expanded}
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Close full map' : 'Expand map'}
                </button>
                <span className={styles.badge}>
                  {session ? 'Saved session' : 'Live view'}
                </span>
              </div>
              <div className={styles.map}>
                <AnimatedLocationMap />
              </div>
            </section>
            <section className={styles.panel}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Camera feed</h2>
                  <p>On-board view</p>
                </div>
              </div>
              <div className={styles.video}>
                <VideoFeed />
              </div>
            </section>
          </div>
          <div className={styles.column}>
            <section
              className={styles.analytics}
              aria-label="Telemetry and lap timing"
            >
              <RiderAnalytics />
            </section>
            <RiderRankings />
            <section className={styles.panel}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>Session details</h2>
                  <p>Connection status and latest readings</p>
                </div>
              </div>
              <div className={styles.details}>
                <DataDisplay />
              </div>
            </section>
          </div>
        </div>
      </main>
    </LapProvider>
  );
}
export default function DashboardView(): JSX.Element {
  return (
    <SessionHistoryProvider>
      <DashboardContent />
    </SessionHistoryProvider>
  );
}
