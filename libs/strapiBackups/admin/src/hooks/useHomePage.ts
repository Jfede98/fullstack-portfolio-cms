import { useCallback, useEffect, useState } from 'react';
import { useReducerState } from './useState';
import { setBackups, setCurrentPage, setRestoreDialogOpen } from '../actions/state';
import { useIntl } from 'react-intl';

import { type IntlShape } from 'react-intl';
import { type RestorePhase } from '../interfaces/homepage';

export const useHomePage = (): {
  formatMessage: IntlShape['formatMessage'];
  handleRestoreClick: () => void;
  selectedBackup: string | null;
  isRestoreDialogOpen: boolean;
  handleCreateBackup: () => Promise<void>;
  handlerSelectBackup: (filename: string | null) => void;
  loading: boolean;
  isCreating: boolean;
  handlerDeleteClick: () => void;
  isRestoring: boolean;
  restorePhase: RestorePhase;
} => {
  const { formatMessage } = useIntl();
  const [isCreating, setIsCreating] = useState(false);
  const {
    handlerSetLoading,
    handlerSelectBackup,
    loading,
    refreshCounter,
    selectedBackup,
    toggleNotification,
    handlerSetRefreshCounter,
    handlerDeleteClick,
    restorePhase,
    isRestoring,
    fetching: { get, post },
    dispatch,
    isRestoreDialogOpen,
  } = useReducerState();

  const fetchBackups = useCallback(async () => {
    handlerSetLoading(true);
    try {
      const { data } = await get('/strapi-backups/list');
      if (data && data.backups) {
        dispatch(setBackups(data.backups));
        dispatch(setCurrentPage(1));
      } else if (data && data.error === 'settings_missing') {
        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: 'strapi-backups.list.settings-missing',
            defaultMessage: 'Please configure S3 Bucket and Path in the Settings first.',
          }),
        });
      }
    } catch {
      toggleNotification({
        type: 'danger',
        message: formatMessage({
          id: 'strapi-backups.list.error',
          defaultMessage: 'Failed to fetch backups from S3',
        }),
      });
    } finally {
      handlerSetLoading(false);
    }
  }, [get, toggleNotification, formatMessage, refreshCounter]);

  const handleCreateBackup = useCallback(async () => {
    setIsCreating(true);
    try {
      const { data } = await post('/strapi-backups/create');
      if (data && data.success) {
        toggleNotification({ type: 'success', message: 'Backup creado exitosamente' });
        handlerSetRefreshCounter();
      } else {
        toggleNotification({ type: 'danger', message: data?.message || 'Error ejecutando script' });
      }
    } catch {
      toggleNotification({ type: 'danger', message: 'Error al crear el backup' });
    } finally {
      setIsCreating(false);
    }
  }, [post, toggleNotification]);

  const handleRestoreClick = () => {
    if (!selectedBackup) return;
    dispatch(setRestoreDialogOpen(true));
  };

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  return {
    formatMessage,
    handleRestoreClick,
    selectedBackup,
    isRestoreDialogOpen,
    handleCreateBackup,
    handlerSelectBackup,
    loading,
    isCreating,
    handlerDeleteClick,
    isRestoring,
    restorePhase,
  };
};
