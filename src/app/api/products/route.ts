import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '10';

  const backendUrl = new URL('http://recommender.barchinet.com:8080/products');
  backendUrl.searchParams.set('page', page);
  backendUrl.searchParams.set('per_page', per_page);

  try {
    const backendRes = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products', details: String(error) },
      { status: 500 }
    );
  }
}
