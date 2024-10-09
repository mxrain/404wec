import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 如果是验证页面，直接放行
  if (pathname.startsWith('/verify')) {
    return NextResponse.next();
  }
  
  if (!pathname.startsWith('/sys')) {
    return NextResponse.next();
  }
  // 获取token
  const token = req.cookies.get('token')?.value;

  if (!token) {
    // 如果没有token，重定向到验证页面
    return NextResponse.redirect(new URL('/verify', req.url));
  }

  try {
    // 发送请求到验证API
    const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verify`, {
      method: 'GET',
      headers: {
        'Cookie': `token=${token}`
      }
    });

    if (verifyResponse.ok) {
      // 如果验证成功，允许访问
      return NextResponse.next();
    } else {
      // 如果验证失败，重定向到验证页面
      return NextResponse.redirect(new URL('/verify', req.url));
    }
  } catch (error) {
    console.error('Token验证过程中出错:', error);
    // 如果出现错误，重定向到验证页面
    return NextResponse.redirect(new URL('/verify', req.url));
  }
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};