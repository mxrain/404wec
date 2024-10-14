import { NextResponse } from 'next/server';
import axios from 'axios';

const DATA_URL = `https://raw.gitmirror.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/master/src/db/uuid_resource_curd.json`;

export async function GET() {
  try {
    const response = await axios.get(DATA_URL);
    const data = response.data;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取类别数据时出错:', error);
    return NextResponse.json({ error: '获取类别数据失败' }, { status: 500 });
  }
}