import { useCallback } from 'react';
import { useReducerState } from './useState';
import { setDeleteDialogOpen } from '../actions/state';

export const useRemove = () => {
  const {
    handlerSetLoading,
    handlerSelectBackup,
    selectedBackup,
    toggleNotification,
    isDeleteDialogOpen,
    handlerSetRefreshCounter,
    fetching: { post },
    dispatch,
  } = useReducerState();

  const fetchingRemoveFile = useCallback(async () => {
    try {
      const { data } = await post('/strapi-backups/delete', { filename: selectedBackup });

      if (data && data.success) {
        toggleNotification({ type: 'success', message: 'Backup eliminado exitosamente' });
        handlerSetRefreshCounter();
      } else {
        toggleNotification({ type: 'danger', message: data?.message || 'Error eliminando backup' });
      }
    } catch {
      toggleNotification({ type: 'danger', message: 'Error al intentar eliminar el backup' });
    } finally {
      handlerSelectBackup(null);
      handlerSetLoading(false);
    }
  }, [post, toggleNotification, selectedBackup]);

  const handlerSetDeleteDialogOpen = (isOpen: boolean) => dispatch(setDeleteDialogOpen(isOpen));

  const handleConfirmDelete = useCallback(async () => {
    dispatch(setDeleteDialogOpen(false));
    handlerSetLoading(true);
    await fetchingRemoveFile();
  }, [toggleNotification, fetchingRemoveFile]);

  return {
    handleConfirmDelete,
    isDeleteDialogOpen,
    selectedBackup,
    handlerSetDeleteDialogOpen,
  };
};
