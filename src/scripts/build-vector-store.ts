import { Command } from "commander";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Index, Pinecone } from "@pinecone-database/pinecone";
import { prisma } from "@/lib/prisma";
import { Document } from "@langchain/core/documents";

const program = new Command();

program
  .name("build-vector-store")
  .description(
    "Build vector store from candidates using Pinecone and LangChain"
  )
  .option("-c, --clean", "Clean up the vector store before starting")
  .option(
    "-d, --dry-run",
    "Perform a dry run without actually updating the vector store"
  )
  .parse(process.argv);

const options = program.opts();

interface VectorStoreConfig {
  pineconeApiKey: string;
  pineconeIndex: string;
  openAIApiKey: string;
}

async function initializeVectorStore(config: VectorStoreConfig) {
  const pinecone = new Pinecone({
    apiKey: config.pineconeApiKey,
  });

  const index = pinecone.Index(config.pineconeIndex);
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: config.openAIApiKey,
  });

  return await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index as any,
    namespace: "candidates",
  });
}

async function cleanVectorStore(index: Index, isDryRun: boolean) {
  console.log("Cleaning up vector store...");

  if (!isDryRun) {
    await index.deleteAll();
  }
}

async function fetchCandidates() {
  return await prisma.candidate.findMany({
    include: {
      experiences: true,
      education: true,
      industries: true,
    },
  });
}

function createDocumentFromCandidate(candidate: any, index: number): Document {
  const documentContent = `${candidate.name}\n--------\n\n${candidate.rawResume}`;

  return {
    pageContent: documentContent,
    metadata: {
      candidateId: candidate.id,
      candidateName: candidate.name,
      industries: candidate.industries.map((i: any) => i.name),
      skills: candidate.skills,
      index: index + 1, // 1-based index
    },
  };
}

async function processCandidateBatch(
  candidates: any[],
  startIndex: number,
  batchSize: number
): Promise<Document[]> {
  const candidateBatch = candidates.slice(startIndex, startIndex + batchSize);
  const batchNumber = Math.floor(startIndex / batchSize) + 1;
  const totalBatches = Math.ceil(candidates.length / batchSize);
  console.log(`Processing batch ${batchNumber}/${totalBatches}`);

  return candidateBatch.map((candidate, batchIndex) => {
    const globalIndex = startIndex + batchIndex;
    console.log(
      `Processing candidate: ${candidate.name} (${globalIndex + 1}/${
        candidates.length
      })`
    );
    return createDocumentFromCandidate(candidate, globalIndex);
  });
}

async function addDocumentsToVectorStore(
  vectorStore: PineconeStore,
  documents: Document[],
  isDryRun: boolean
) {
  if (isDryRun) {
    console.log(`Would add ${documents.length} documents to vector store`);
    return;
  }

  console.log(`Adding ${documents.length} documents to vector store...`);
  await vectorStore.addDocuments(documents);
  console.log(`Successfully added ${documents.length} documents`);
}

async function createPineconeIndex(pinecone: Pinecone, indexName: string) {
  try {
    console.log(`Creating Pinecone index: ${indexName}`);

    const index = await pinecone.describeIndex(indexName);

    if (index) {
      console.log(`Index ${indexName} already exists`);
      return;
    }

    await pinecone.createIndexForModel({
      name: indexName,
      waitUntilReady: true,
      cloud: "aws",
      region: "us-east-1",
      embed: {
        model: "text-embedding-3-small",
      },
    });

    console.log("Index created successfully");
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log(`Index ${indexName} already exists`);
    } else {
      throw error;
    }
  }
}

async function main() {
  const config: VectorStoreConfig = {
    pineconeApiKey: process.env.PINECONE_API_KEY!,
    pineconeIndex: process.env.PINECONE_INDEX!,
    openAIApiKey: process.env.OPENAI_API_KEY!,
  };

  // Initialize Pinecone
  const pinecone = new Pinecone({
    apiKey: config.pineconeApiKey,
  });

  // Create index if it doesn't exist
  await createPineconeIndex(pinecone, config.pineconeIndex);

  const vectorStore = await initializeVectorStore(config);
  const index = (vectorStore as any).pineconeIndex;

  if (options.clean) {
    await cleanVectorStore(index, options.dryRun);
  }

  const candidates = await fetchCandidates();
  console.log(`Found ${candidates.length} candidates`);

  const BATCH_SIZE = 10;
  const VECTOR_STORE_BATCH_SIZE = 100;
  let allDocuments: Document[] = [];

  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batchDocuments = await processCandidateBatch(
      candidates,
      i,
      BATCH_SIZE
    );
    allDocuments.push(...batchDocuments);

    if (
      allDocuments.length >= VECTOR_STORE_BATCH_SIZE ||
      i + BATCH_SIZE >= candidates.length
    ) {
      await addDocumentsToVectorStore(
        vectorStore,
        allDocuments,
        options.dryRun
      );
      allDocuments = [];
    }
  }

  console.log("Vector store build completed");
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
