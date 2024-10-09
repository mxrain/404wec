import { NextResponse } from 'next/server';

const DATA_URL = 'https://raw.gitmirror.com/mxrain/404zyt/master/src/db/db.json';

export async function GET() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error('获取数据失败');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取类别数据时出错:', error);
    return NextResponse.json({ error: '获取类别数据失败' }, { status: 500 });
  }
}