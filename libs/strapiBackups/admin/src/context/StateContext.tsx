import React, { createContext, useReducer, useMemo, ReactNode, Dispatch } from 'react';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { StateReducer } from '../reducer/state';
import { initState } from '../helper/initState';
import { type IState, type IAction } from '../interfaces/state';

interface StateContextValue extends IState {
  dispatch: Dispatch<IAction>;
  fetching: ReturnType<typeof useFetchClient>;
  toggleNotification: ReturnType<typeof useNotification>['toggleNotification'];
}

export const StateContext = createContext<StateContextValue | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(StateReducer, initState);
  const fetching = useFetchClient();
  const { toggleNotification } = useNotification();

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
      fetching,
      toggleNotification,
    }),
    [state, dispatch, fetching, toggleNotification]
  );

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};
