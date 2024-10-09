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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
        setStatus('success');
      } catch (error) {
        console.error('获取类别数据时出错:', error);
        setStatus('error');
        setError('获取类别数据失败');
      }
    };

    fetchData();
  }, []);

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