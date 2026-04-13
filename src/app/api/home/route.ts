import { fetchHomepageData } from '@/lib/api/home';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await fetchHomepageData();
  if (!data) {
    return Response.json({ videoBanner: null }, { status: 404 });
  }

  return Response.json({
    videoBanner: data.videoBanner ?? null,
  });
}

