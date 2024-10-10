"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';

type CategoryData = {
  [key: string]: {
    icon: string;
    link: string;
    items?: CategoryData;
  };
};

type DataContextType = {
  categories: CategoryData;
  status: 'loading' | 'success' | 'error';
  error: string | null;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryData>({});
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);


  return (
    <DataContext.Provider value={{ categories, status, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData必须在DataProvider内部使用');
  }
  return context;
};