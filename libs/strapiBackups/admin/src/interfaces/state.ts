import { type RestorePhase } from './homepage';

export interface IBackup {
  filename: string;
  date: string;
  hour: string;
  size?: string;
}

export interface IState {
  loading: boolean;
  selectedBackup: string | null;
  refreshCounter: number;
  isDeleteDialogOpen: boolean;
  isRestoreDialogOpen: boolean;
  isRestoring: boolean;
  restorePhase: RestorePhase;
  backups: IBackup[];
  currentPage: number;
}

export interface IAction {
  type: StateType;
  payload?: Partial<IState>;
}

export enum StateType {
  loading = 'LOADING',
  selectedBackup = 'SELECTED_BACKUP',
  refreshCounter = 'REFRESH_COUNTER',
  isDeleteDialogOpen = 'IS_DELETE_DIALOG_OPEN',
  isRestoreDialogOpen = 'IS_RESTORE_DIALOG_OPEN',
  isRestoring = 'IS_RESTORING',
  restorePhase = 'RESTORE_PHASE',
  backups = 'BACKUPS',
  currentPage = 'CURRENT_PAGE',
}
