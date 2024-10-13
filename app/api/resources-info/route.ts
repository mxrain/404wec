import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = `https://raw.gitmirror.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/refs/heads/master/src/db/zyt`;

export async function POST(request: NextRequest) {
    const { uuid } = await request.json();
    try {

        if (!uuid) {
            return NextResponse.json({ error: '缺少 UUID 参数' }, { status: 400 });
        }

        const DATA_URL = `${BASE_URL}/${uuid}.json`;

        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`获取数据失败: ${response.statusText}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('获取资源数据时出错:', error);
        return NextResponse.json({ error: '获取资源数据失败', path: `${BASE_URL}/${uuid}.json` }, { status: 500 });
    }
}

