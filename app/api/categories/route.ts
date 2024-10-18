import { NextResponse } from 'next/server';
import axios from 'axios';
import { config } from '@/appConfig';

const DATA_URL = `${config.apiBaseUrl}/categories.json`;

export async function GET() {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');
  try {
    const response = await axios.get(DATA_URL);
    const data = response.data;
    return NextResponse.json(data, { headers });


  } catch (error) {
    console.error('获取分类数据时出错:', error);
    return NextResponse.json({ error: '获取分类数失败' }, { status: 500 });
  }
}