import { RESTORE_LS_KEY } from '../constants/homepage';
import type { RestoreRecord } from '../interfaces/homepage';

export const lsSave = (r: RestoreRecord) => localStorage.setItem(RESTORE_LS_KEY, JSON.stringify(r));
export const lsClear = () => localStorage.removeItem(RESTORE_LS_KEY);
export const lsLoad = (): RestoreRecord | null => {
  try {
    const raw = localStorage.getItem(RESTORE_LS_KEY);
    return raw ? (JSON.parse(raw) as RestoreRecord) : null;
  } catch {
    return null;
  }
};
