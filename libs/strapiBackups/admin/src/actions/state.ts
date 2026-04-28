import { type IAction, type IState, StateType } from '../interfaces/state';

export const setLoading = (loading: IState['loading']): IAction => ({
  type: StateType.loading,
  payload: { loading },
});

export const setSelectedBackup = (selectedBackup: IState['selectedBackup']): IAction => ({
  type: StateType.selectedBackup,
  payload: { selectedBackup },
});

export const setRefreshCounter = (refreshCounter: IState['refreshCounter']): IAction => ({
  type: StateType.refreshCounter,
  payload: { refreshCounter },
});

export const setDeleteDialogOpen = (isDeleteDialogOpen: IState['isDeleteDialogOpen']): IAction => ({
  type: StateType.isDeleteDialogOpen,
  payload: { isDeleteDialogOpen },
});

export const setRestoreDialogOpen = (
  isRestoreDialogOpen: IState['isRestoreDialogOpen']
): IAction => ({
  type: StateType.isRestoreDialogOpen,
  payload: { isRestoreDialogOpen },
});

export const setIsRestoring = (isRestoring: IState['isRestoring']): IAction => ({
  type: StateType.isRestoring,
  payload: { isRestoring },
});

export const setRestorePhase = (restorePhase: IState['restorePhase']): IAction => ({
  type: StateType.restorePhase,
  payload: { restorePhase },
});

export const setBackups = (backups: IState['backups']): IAction => ({
  type: StateType.backups,
  payload: { backups },
});

export const setCurrentPage = (currentPage: IState['currentPage']): IAction => ({
  type: StateType.currentPage,
  payload: { currentPage },
});
