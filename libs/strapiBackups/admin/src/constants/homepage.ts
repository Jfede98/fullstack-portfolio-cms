import { type RestorePhase } from '../interfaces/homepage';

export const POLLING_INTERVAL_MS = 3_000;
export const POLLING_START_DELAY = 12_000;
export const POLLING_TIMEOUT_MS = 3 * 60_000;
export const RESTORE_LS_KEY = 'sb_restore_in_progress';
export const PAGE_SIZE = 10;

export const PHASE_MESSAGES: Record<RestorePhase, string> = {
  starting: 'Iniciando proceso de restauración…',
  waiting: 'Aplicando cambios en la base de datos…',
  reconnecting: 'Esperando que el servidor vuelva en línea…',
  done: '¡Restauración completada! Recargando página…',
  error: 'Ocurrió un error al iniciar la restauración.',
};

export const PHASE_ORDER: RestorePhase[] = ['starting', 'waiting', 'reconnecting'];
