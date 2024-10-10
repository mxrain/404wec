'use client'

import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchCategoriesAsync } from '@/app/store/categoriesSlice';
import { fetchResourcesAsync } from '@/app/store/resourcesSlice';
import ResourceCard from '@/components/ResourceCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Resource } from '@/app/sys/add/types';
import Link from 'next/link';

interface Category {
  link: string;
  items?: Record<string, Category>;
}

const findCategoryPath = (categories: Record<string, Category>, slug: string): string[] => {
  if (categories[slug]) return [slug];

  for (const [key, value] of Object.entries(categories)) {
    if (value.link === `/${slug}/` || value.link === `/${slug}` || value.link === slug) {
      return [key];
    }
    if (value.items) {
      const subPath = findCategoryPath(value.items, slug);
      if (subPath.length > 0) {
        return [key, ...subPath];
      }
    }
  }
  return [];
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const dispatch = useAppDispatch();
  const { data: categories, status: categoryStatus, error: categoryError } = useAppSelector((state) => state.categories);
  const { data: resources, status: resourceStatus, error: resourceError } = useAppSelector((state) => state.resources);

  useEffect(() => {
    if (categoryStatus === 'idle') dispatch(fetchCategoriesAsync());
    if (resourceStatus === 'idle') dispatch(fetchResourcesAsync());
  }, [dispatch, categoryStatus, resourceStatus]);

  const categoryPath = useMemo(() => 
    categoryStatus === 'succeeded' ? findCategoryPath(categories, params.slug) : []
  , [categoryStatus, categories, params.slug]);

  const currentCategory = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : params.slug;
  const currentCategoryData = categories[currentCategory] as Category | undefined;

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    
    const categoryString = categoryPath.join(' > ');
    
    return Object.entries(resources)
      .filter(([, resource]: [string, Resource]) => 
        resource.category === categoryString ||
        resource.category.startsWith(categoryString + ' > ') ||
        (categoryPath.length === 1 && resource.category.startsWith(currentCategory))
      )
      .map(([uuid, resource]) => ({ ...resource, uuid }));
  }, [resources, categoryPath, currentCategory]);

  const showSubcategories = filteredResources.length === 0 && !!currentCategoryData?.items;

  const isLoading = categoryStatus === 'loading' || resourceStatus === 'loading';

  if (categoryStatus === 'failed') return <div>错误：{categoryError}</div>;
  if (resourceStatus === 'failed') return <div>错误：{resourceError}</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-4">{currentCategory}</h1>
      <p className="text-gray-600 mb-4">
        {categoryPath.length > 0 ? `分类路径：${categoryPath.join(' > ')}` : '顶层分类'}
      </p>
      
      {showSubcategories ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">子分类：</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(currentCategoryData!.items!).map(([key, value]) => (
              <li key={key} className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors">
                <Link href={`/category${value.link}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                  {key}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">资源列表：</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <ResourceCard 
                  key={resource.uuid}
                  resource={resource}
                />
                
              ))}
              
            </div>
          ) : (
            <p>该分类下暂无资源。</p>
          )}
        </>
      )}
    </div>
  );
}