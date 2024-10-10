'use client'

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchCategoriesAsync } from '@/app/store/categoriesSlice';

interface Category {
  link: string;
  items?: Record<string, Category>;
}

function findCategoryPath(categories: Record<string, Category>, slug: string): string[] {
  for (const [key, value] of Object.entries(categories)) {
    if (value.link === `/${slug}/`) {
      return [key];
    }
    if (value.items) {
      const subPath = findCategoryPath(value.items, slug);
      if (subPath.length > 0) {
        return [key, ...subPath];
      }
    }
  }
  // 如果没有找到子分类，检查是否为父分类
  if (categories[slug]) {
    return [slug];
  }
  return [];
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const dispatch = useAppDispatch();
  const { data: categories, status, error } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategoriesAsync());
    }
  }, [dispatch, status]);

  const categoryPath = status === 'succeeded' ? findCategoryPath(categories, params.slug) : [];
  const currentCategory = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : params.slug;

  if (status === 'loading') {
    return <div>加载中...</div>;
  }

  if (status === 'failed') {
    return <div>错误：{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{currentCategory}</h1>
      {categoryPath.length > 0 ? (
        <p className="text-gray-600 mb-4">分类路径：{categoryPath.join(' > ')}</p>
      ) : (
        <p className="text-gray-600 mb-4">未找到分类路径</p>
      )}
      <p>这里是 {currentCategory} 分类的内容。</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">所有分类：</h2>
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
        {JSON.stringify(categories, null, 2)}
      </pre>
    </div>
  );
}