import type { IState } from '../interfaces/state';

export const initState: IState = {
  loading: false,
  selectedBackup: null,
  refreshCounter: 0,
  isDeleteDialogOpen: false,
  isRestoreDialogOpen: false,
  isRestoring: false,
  restorePhase: 'starting',
  backups: [],
  currentPage: 1,
};
