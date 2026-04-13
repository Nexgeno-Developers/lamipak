import { revalidateApiCache } from '@/lib/api/apiCache';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  const expected = (process.env.CACHE_CLEAR_TOKEN || '').trim();

  if (expected && token !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  revalidateApiCache();

  return Response.json({
    ok: true,
    cleared: true,
    at: new Date().toISOString(),
  });
}
