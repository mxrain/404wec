import React from 'react';
import Image from 'next/image';  // 添加这行导入
import { Resource } from '@/app/sys/add/types';

interface ResourceCardProps {
  resource: Pick<Resource, 'name' | 'images' | 'tags' | 'introduction' | 'source_links' | 'uploaded' | 'update_time'>;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <Image 
        src={resource.images[0]} 
        alt={resource.name} 
        width={200} 
        height={200} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{resource.name}</h3>
        <p className="text-gray-700 text-base mb-2">{resource.introduction?.slice(0, 100)}...</p>
        <div className="flex flex-wrap">
          {resource.tags.map((tag: string) => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;