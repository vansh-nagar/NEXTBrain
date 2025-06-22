import { CohereClient } from "cohere-ai";
import pgvector from "pgvector";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function createEmbed({ document }: { document: string[] }) {
  const embedding: any = await co.embed({
    texts: document,
    model: "embed-v4.0",
    inputType: "search_document",
    embeddingTypes: ["float"],
  });

  const sqlVec = pgvector.toSql(embedding.embeddings.float[0]);

  return sqlVec;
}
