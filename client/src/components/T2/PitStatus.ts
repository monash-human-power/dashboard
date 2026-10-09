export interface PitStatus {
  sessionId: string;
  state: 'idle' | 'preparing' | 'pitting' | 'completed' | 'cancelled';
  version: number;
  requestedBy: string | null;
  acknowledgedAt: string | null;
  timestamp?: string;
}
