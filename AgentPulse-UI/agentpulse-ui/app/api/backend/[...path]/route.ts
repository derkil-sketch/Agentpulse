import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const backend = (process.env.AGENTPULSE_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const incoming = new URL(request.url);
  const target = `${backend}/${path.map(encodeURIComponent).join('/')}${incoming.search}`;
  try {
    const headers = new Headers();
    const contentType = request.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
      cache: 'no-store',
      signal: AbortSignal.timeout(30000),
    });
    return new NextResponse(response.body, { status: response.status, headers: { 'content-type': response.headers.get('content-type') || 'application/json', 'cache-control': 'no-store' } });
  } catch {
    return NextResponse.json({ detail: 'AgentPulse backend is unreachable. Start the FastAPI server and check AGENTPULSE_BACKEND_URL.' }, { status: 502 });
  }
}
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
