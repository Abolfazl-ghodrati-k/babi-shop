import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category');
  const min_price = searchParams.get('min_price') || '0';
  const max_price = searchParams.get('max_price') || `${Number.MAX_SAFE_INTEGER}`;
  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '10';

  const backendUrl = new URL('http://recommender.barchinet.com:8080/search');
  backendUrl.searchParams.set('query', query);
  backendUrl.searchParams.set('min_price', min_price);
  backendUrl.searchParams.set('max_price', max_price);
  backendUrl.searchParams.set('page', page);
  backendUrl.searchParams.set('per_page', per_page);
  if (category) backendUrl.searchParams.set('category', category);

  try {
    const response = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch search results', details: String(error) },
      { status: 500 }
    );
  }
}
