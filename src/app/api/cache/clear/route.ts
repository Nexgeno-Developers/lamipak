import { revalidateApiCache } from '@/lib/api/apiCache';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  const expected = (process.env.CACHE_CLEAR_TOKEN || '').trim();

  if (!expected) {
    return new Response('CACHE_CLEAR_TOKEN is not configured', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  if (!token || token !== expected) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  revalidateApiCache();

  return Response.json(
    {
      ok: true,
      cleared: true,
      at: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
