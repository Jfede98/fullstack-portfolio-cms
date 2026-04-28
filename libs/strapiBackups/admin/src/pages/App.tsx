import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';
import { StateProvider } from '../context/StateContext';

import { HomePage } from './HomePage';

const App = () => {
  return (
    <StateProvider>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="*" element={<Page.Error />} />
      </Routes>
    </StateProvider>
  );
};

export { App };