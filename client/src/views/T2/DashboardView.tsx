import React from 'react';
import AnimatedLocationMap from 'components/T2/dashboard/AnimatedLocationMap';
import VideoFeed from 'components/T2/dashboard/VideoFeed';
import DataDisplay from 'components/T2/dashboard/DataDisplay';
import SavedSessions from 'components/T2/dashboard/SavedSessions';
import RiderAnalytics from 'components/T2/statistics/RiderRanker';
import { LapProvider } from 'components/T2/LapContext';
import {
  SessionHistoryProvider,
  useSessionHistory,
} from 'components/T2/SessionHistory';
import styles from './DashboardView.module.css';

function DashboardContent(): JSX.Element {
  const { session, revision } = useSessionHistory();
  return (
    <LapProvider key={`${session || 'live'}-${revision}`}>
      <main className={styles.dashboard}>
        <div className={styles.heading}>
          <h1>T2 Session Dashboard</h1>
          <SavedSessions />
        </div>
        <div className={styles.overview}>
          <div className={`${styles.column} ${styles.mapColumn}`}>
            <section className={styles.mapCard} aria-label="Track map">
              <div className={styles.cardHeader}>
                <div>
                  <h2>Track & checkpoints</h2>
                  <p>
                    Yellow starts the lap. Add purple points in riding order.
                  </p>
                </div>
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
