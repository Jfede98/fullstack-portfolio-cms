import { useContext } from 'react';
import { StateContext } from '../context/StateContext';
import { type IState } from '../interfaces/state';
import {
  setDeleteDialogOpen,
  setLoading,
  setRefreshCounter,
  setSelectedBackup,
} from '../actions/state';

export const useReducerState = () => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error('useReducerState must be used within a StateProvider');
  }

  const { dispatch, fetching, toggleNotification, ...state } = context;

  const handlerSetLoading = (loading: IState['loading']) => dispatch(setLoading(loading));

  const handlerSelectBackup = (filename: string | null) => {
    const prev = state.selectedBackup;
    dispatch(setSelectedBackup(prev === filename ? null : filename));
  };

  const handlerSetRefreshCounter = () => {
    const prev = state.refreshCounter ?? 0;
    dispatch(setRefreshCounter(prev + 1));
  };

  const handlerDeleteClick = () => {
    if (!state.selectedBackup) return;
    dispatch(setDeleteDialogOpen(true));
  };

  return {
    ...state,
    dispatch,
    handlerSetLoading,
    handlerSelectBackup,
    handlerSetRefreshCounter,
    fetching,
    toggleNotification,
    handlerDeleteClick,
  };
};
