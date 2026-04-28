import { useIntl } from 'react-intl';
import { useReducerState } from './useState';
import { PAGE_SIZE } from '../constants/homepage';
import { setCurrentPage } from '../actions/state';

import { type IntlShape } from 'react-intl';
import { type IBackup } from '../interfaces/state';

export const useListBackupts = (): {
  loading: boolean;
  backups: IBackup[];
  currentPage: number;
  formatMessage: IntlShape['formatMessage'];
  currentBackups: IBackup[];
  handlerSelectBackup: (filename: string | null) => void;
  selectedBackup: string | null;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
} => {
  const { loading, backups, currentPage, handlerSelectBackup, selectedBackup, dispatch } =
    useReducerState();
  const { formatMessage } = useIntl();

  const currentBackups = backups.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(backups.length / PAGE_SIZE));

  const handlePrevPage = () => {
    const prev = currentPage;
    dispatch(setCurrentPage(Math.max(1, prev - 1)));
  };

  const handleNextPage = () => {
    const prev = currentPage;
    dispatch(setCurrentPage(Math.min(totalPages, prev + 1)));
  };

  return {
    loading,
    backups,
    currentPage,
    formatMessage,
    currentBackups,
    handlerSelectBackup,
    selectedBackup,
    totalPages,
    handlePrevPage,
    handleNextPage,
  };
};
