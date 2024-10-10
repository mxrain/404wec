'use client'

import { useEffect } from 'react';
import ClientLayout from '@/app/components/ClientLayout';
import { fetchCategoriesAsync } from '@/app/store/categoriesSlice';
import { fetchResourcesAsync } from '@/app/store/resourcesSlice';
import { useAppDispatch } from '@/app/store/hooks';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
    dispatch(fetchResourcesAsync());
  }, [dispatch]);

  return <ClientLayout>{children}</ClientLayout>;
}