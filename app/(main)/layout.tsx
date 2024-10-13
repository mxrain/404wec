'use client'

import { useEffect } from 'react';
import Header from '@/app/components/Header';
import { fetchCategoriesAsync } from '@/app/store/features/categories/categoriesSlice';
import { fetchResourcesAsync } from '@/app/store/resourcesSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { status: categoriesStatus } = useAppSelector((state) => state.categories);
  const { status: resourcesStatus } = useAppSelector((state) => state.resources);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategoriesAsync());
    }
    if (resourcesStatus === 'idle') {
      dispatch(fetchResourcesAsync());
    }
  }, [dispatch, categoriesStatus, resourcesStatus]);

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}