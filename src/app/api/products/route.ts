import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const backendRes = await fetch('http://recommender.barchinet.com:8080/products', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await backendRes.json();
  return NextResponse.json(data);
}
