import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '../context/DataContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Loader2, ChevronRight } from "lucide-react";

interface CategoryData {
  [key: string]: {
    icon: string;
    link: string;
    items?: CategoryData;
  };
}

const CategoryMenu = ({ categories }: { categories: CategoryData }) => {
  return (
    <ul className="p-2 w-56">
      {Object.entries(categories).map(([key, value]) => (
        <li key={key} className="relative group">
          <Link
            href={`/category${value.link}`}
            className="flex items-center justify-between py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            <span>{key}</span>
            {value.items && <ChevronRight className="h-4 w-4" />}
          </Link>
          {value.items && (
            <div className="absolute left-full top-0 hidden group-hover:block">
              <CategoryMenu categories={value.items} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default function Header() {
  const { categories, status, error } = useData();

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-16"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 加载中...</div>;
  }

  if (status === 'error') {
    return <div className="flex justify-center items-center h-16 text-red-500">错误: {error}</div>;
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-bold">
          资源桶
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>分类</NavigationMenuTrigger>
              <NavigationMenuContent>
                <CategoryMenu categories={categories} />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="https://chatbot.weixin.qq.com/webapp/zR6XpGC9NjMrGjpuuboUQACIxqCwLZ?robotName=%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2%E6%9C%BA%E5%99%A8%E4%BA%BA" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  资源求助
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}