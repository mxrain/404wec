'use client'

import React from 'react';
import { DataProvider } from '../context/DataContext';
import Header from './Header';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DataProvider>
      <Header />
      <main>{children}</main>
    </DataProvider>
  );
};

export default ClientLayout;