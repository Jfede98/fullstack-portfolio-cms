export type RestorePhase = 'starting' | 'waiting' | 'reconnecting' | 'done' | 'error';

export interface RestoreRecord {
  startedAt: number;
  filename: string;
}
