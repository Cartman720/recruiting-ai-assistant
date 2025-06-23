import pg from "pg";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

/**
 * This script creates the necessary tables in the database for the checkpointer to work.
 * It should be run once after the database is created.
 */
async function main() {
  const { Pool } = pg;

  const pool = new Pool({
    connectionString: process.env.LANGGRAPH_CHECKPOINTER_URL,
  });

  const checkpointer = new PostgresSaver(pool);

  await checkpointer.setup();
}

main();
