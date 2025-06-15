import { NextResponse } from 'next/server';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX!);

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY!,
});

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex: index as any,
  namespace: 'candidates',
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const results = await vectorStore.similaritySearchWithScore(query, 5);

    const formattedResults = results.map(([doc, score]) => ({
      candidateId: doc.metadata.candidateId,
      candidateName: doc.metadata.candidateName,
      industries: doc.metadata.industries,
      skills: doc.metadata.skills,
      score: score,
    }));

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 