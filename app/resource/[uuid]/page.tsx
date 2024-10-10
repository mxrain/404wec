'use client'

import React, { useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
// import { fetchResourcesAsync } from '@/app/store/resourcesSlice';
// import { Skeleton } from "@/components/ui/skeleton";
// import Image from 'next/image';
// import Link from 'next/link';
// import { Resource } from '@/app/sys/add/types';

export default function ResourceDetailPage({ params }: { params: { uuid: string } }) {
  


  return (
    <div>
        {params.uuid}
    </div>
  )
}