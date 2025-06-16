import { Command } from "commander";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Index, Pinecone } from "@pinecone-database/pinecone";
import { prisma } from "@/lib/prisma";
import { Document } from "@langchain/core/documents";
import { formatDate } from "date-fns";
import { Education, Experience, Industry } from "@/generated/prisma";

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
    await index.namespace("candidates").deleteAll();
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

export function buildExperience(experiences: Experience[]) {
  if (!experiences.length) return "";
  const header = "Experience:";
  const lines = experiences.map((exp) => {
    const start = exp.startDate ? formatDate(exp.startDate, "MM/yyyy") : "";
    const end = exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present";
    return `- ${exp.title} @ ${exp.company} (${start} – ${end}): ${exp.description}`;
  });
  return [header, ...lines].join("\n");
}

export function buildEducation(education: Education[]) {
  if (!education.length) return "";
  const header = "Education:";
  const lines = education.map((ed) => {
    const start = ed.startDate ? formatDate(ed.startDate, "MM/yyyy") : "";
    const end = ed.endDate ? formatDate(ed.endDate, "MM/yyyy") : "Present";
    return `- ${ed.degree}, ${ed.school} (${start} – ${end})`;
  });
  return [header, ...lines].join("\n");
}

function createDocumentFromCandidate(candidate: any): Document {
  const documentContent = `
      Name: ${candidate.name}
      Title: ${candidate.title || ""}
      
      Summary:
      ${candidate.summary}
      
      Experience:
      ${buildExperience(candidate.experiences || [])}
      
      Education:
      ${buildEducation(candidate.education || [])}
      
      Skills: ${candidate.skills?.join(", ") || "N/A"}
      Certifications: ${candidate.certifications?.join(", ") || "None"}
      Languages: ${candidate.languages?.join(", ") || "None"}
      Industries: ${(candidate.industries || [])
        .map((i: Industry) => i.slug || i.name)
        .join(", ")}
      
      Willing to Relocate: ${candidate.willingToRelocate}
      Remote Experience: ${candidate.hasRemoteExperience}
      
      Full Resume:
      ${candidate.rawResume || ""}
  `.trim();

  // Metadata fields for filtering
  const metadata = {
    candidateId: candidate.id,
    name: candidate.name,
    email: candidate.email,
    title: candidate.title,
    yearsOfExperience: candidate.yearsOfExperience,
    educationLevel: candidate.educationLevel,
    expertiseLevel: candidate.expertiseLevel,
    city: candidate.city,
    state: candidate.state,
    country: candidate.country,
    location: candidate.location,
    willingToRelocate: candidate.willingToRelocate,
    hasRemoteExperience: candidate.hasRemoteExperience,
    skills: candidate.skills,
    certifications: candidate.certifications,
    languages: candidate.languages,
    industries: candidate.industries?.map((i: Industry) => i.slug),
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };

  return {
    id: `candidate-${candidate.id}`,
    pageContent: documentContent,
    metadata,
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
    return createDocumentFromCandidate(candidate);
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
