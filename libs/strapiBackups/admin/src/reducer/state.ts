import { initState } from '../helper/initState';
import { StateType, type IAction, type IState } from '../interfaces/state';

export const StateReducer = (state = initState, { type, payload }: IAction): IState => {
  switch (type) {
    case StateType.loading:
      return { ...state, loading: payload?.loading || false };
    case StateType.selectedBackup:
      return { ...state, selectedBackup: payload?.selectedBackup || null };
    case StateType.refreshCounter:
      return { ...state, refreshCounter: payload?.refreshCounter || 0 };
    case StateType.isDeleteDialogOpen:
      return { ...state, isDeleteDialogOpen: payload?.isDeleteDialogOpen || false };
    case StateType.isRestoreDialogOpen:
      return { ...state, isRestoreDialogOpen: payload?.isRestoreDialogOpen || false };
    case StateType.isRestoring:
      return { ...state, isRestoring: payload?.isRestoring || false };
    case StateType.restorePhase:
      return { ...state, restorePhase: payload?.restorePhase || 'starting' };
    case StateType.backups:
      return { ...state, backups: payload?.backups || [] };
    case StateType.currentPage:
      return { ...state, currentPage: payload?.currentPage || 1 };
    default:
      return state;
  }
};
