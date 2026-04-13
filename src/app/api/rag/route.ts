import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';

const BRIDGE = path.join(process.cwd(), 'scripts', 'rag-bridge.py');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, metadata } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Tekst er påkrevd' }, { status: 400 });
    }

    const input = JSON.stringify({ text, metadata: metadata || {} });
    const result = execSync(`python3 "${BRIDGE}" store`, {
      input,
      encoding: 'utf-8',
      timeout: 15000,
    });

    return NextResponse.json(JSON.parse(result));
  } catch (err: unknown) {
    return NextResponse.json(
      { error: `RAG lagring feilet: ${err instanceof Error ? err.message : 'ukjent'}` },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const limit = searchParams.get('limit') || '5';

  if (!query) {
    return NextResponse.json({ error: 'Query-parameter mangler' }, { status: 400 });
  }

  try {
    const result = execSync(
      `python3 "${BRIDGE}" search ${JSON.stringify(query)} ${limit}`,
      { encoding: 'utf-8', timeout: 15000 }
    );

    return NextResponse.json(JSON.parse(result));
  } catch (err: unknown) {
    return NextResponse.json(
      { error: `RAG søk feilet: ${err instanceof Error ? err.message : 'ukjent'}` },
      { status: 500 }
    );
  }
}
