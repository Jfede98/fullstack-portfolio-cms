import { useCallback, useEffect, useRef } from 'react';
import { setIsRestoring, setRestoreDialogOpen, setRestorePhase } from '../actions/state';
import { useReducerState } from './useState';
import { lsClear, lsLoad, lsSave } from '../helper/homepage';
import {
  POLLING_INTERVAL_MS,
  POLLING_START_DELAY,
  POLLING_TIMEOUT_MS,
} from '../constants/homepage';

export const useRestore = () => {
  const {
    dispatch,
    isRestoreDialogOpen,
    fetching: { post },
    selectedBackup,
    toggleNotification,
    handlerSelectBackup,
  } = useReducerState();

  const pollingDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pollingStartedAtRef = useRef<number>(0);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startPollingRef = useRef<() => void>(() => {});

  const handlerSetRestoreDialogOpen = (isOpen: boolean) => dispatch(setRestoreDialogOpen(isOpen));

  const loadPhase = useCallback(() => {
    const saved = lsLoad();
    if (!saved) return;

    const elapsed = Date.now() - saved.startedAt;

    if (elapsed > POLLING_TIMEOUT_MS) {
      lsClear();
      return;
    }

    dispatch(setIsRestoring(true));

    if (elapsed < POLLING_START_DELAY) {
      dispatch(setRestorePhase('waiting'));
      const remaining = POLLING_START_DELAY - elapsed;
      pollingDelayRef.current = setTimeout(() => {
        dispatch(setRestorePhase('reconnecting'));
        startPollingRef.current();
      }, remaining);
    } else {
      dispatch(setRestorePhase('reconnecting'));

      setTimeout(() => startPollingRef.current(), 50);
    }
  }, []);

  const startPolling = useCallback(() => {
    pollingStartedAtRef.current = Date.now();

    pollingIntervalRef.current = setInterval(async () => {
      if (Date.now() - pollingStartedAtRef.current > POLLING_TIMEOUT_MS) {
        clearInterval(pollingIntervalRef.current!);
        lsClear();
        dispatch(setIsRestoring(false));
        toggleNotification({
          type: 'danger',
          message: 'El servidor no respondió en 5 minutos. Verifica los logs de PM2.',
        });
        return;
      }

      try {
        const res = await fetch('/_health', {
          cache: 'no-store',
          signal: AbortSignal.timeout(2500),
        });
        if (res.ok) {
          clearInterval(pollingIntervalRef.current!);
          lsClear();
          dispatch(setRestorePhase('done'));
          setTimeout(() => window.location.reload(), 2_000);
        }
      } catch {}
    }, POLLING_INTERVAL_MS);
  }, [toggleNotification]);

  const handleConfirmRestore = useCallback(async () => {
    dispatch(setRestoreDialogOpen(false));
    dispatch(setRestorePhase('starting'));
    dispatch(setIsRestoring(true));

    try {
      const { data } = await post('/strapi-backups/restore', { filename: selectedBackup });

      if (data && data.success) {
        lsSave({ startedAt: Date.now(), filename: selectedBackup ?? '' });

        dispatch(setRestorePhase('waiting'));
        pollingDelayRef.current = setTimeout(() => {
          dispatch(setRestorePhase('reconnecting'));
          startPolling();
        }, POLLING_START_DELAY);
      } else {
        dispatch(setRestorePhase('error'));
        setTimeout(() => dispatch(setIsRestoring(false)), 3_000);
        toggleNotification({
          type: 'danger',
          message: data?.message || 'Error ejecutando script de restauración',
        });
      }
    } catch {
      dispatch(setRestorePhase('error'));
      setTimeout(() => dispatch(setIsRestoring(false)), 3_000);
      toggleNotification({ type: 'danger', message: 'Error al iniciar la restauración' });
    } finally {
      handlerSelectBackup(null);
    }
  }, [post, toggleNotification, selectedBackup]);

  useEffect(() => {
    return () => {
      if (pollingDelayRef.current) clearTimeout(pollingDelayRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    startPollingRef.current = startPolling;
  }, [startPolling]);

  useEffect(() => {
    loadPhase();
  }, [loadPhase]);

  return { handlerSetRestoreDialogOpen, isRestoreDialogOpen, selectedBackup, handleConfirmRestore };
};
