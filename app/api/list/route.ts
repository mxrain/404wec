import { NextResponse } from 'next/server';
import axios from 'axios';

const DATA_URL = `https://raw.gitmirror.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/master/src/db/list.json`;

export async function GET() {
  // 禁用缓存
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');

  try {
    const response = await axios.get(DATA_URL);
    const data = response.data;
    
    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error('获取列表数据时出错:', error);
    return NextResponse.json({ error: '获取列表数据失败' }, { status: 500 });
  }
}
