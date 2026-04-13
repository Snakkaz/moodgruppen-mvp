import { NextResponse } from 'next/server';

interface Document {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    clientId: string;
    type: string;
    createdAt: string;
  };
}
const vectorStore: Document[] = [];

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

function generateTFIDFEmbedding(text: string): number[] {
  // Simple TF-IDF-based embedding for PoC
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = Array.from(new Set(words));
  return uniqueWords.map(word => words.filter(w => w === word).length);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { id, text, metadata } = body;
  const embedding = generateTFIDFEmbedding(text);

  vectorStore.push({ id, text, embedding, metadata });
  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  if (!query) return NextResponse.json({ error: "Query parameter is missing" }, { status: 400 });

  const queryEmbedding = generateTFIDFEmbedding(query);
  const results = vectorStore
    .map(doc => ({
      ...doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  return NextResponse.json({ results });
}