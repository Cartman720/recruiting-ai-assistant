import path from "path";
import { parse } from "csv-parse/sync";
import * as Bun from "bun";

export async function readDataset(relativePath: string) {
  const filepath = path.resolve(__dirname, "../data", relativePath);
  const rawContent = await Bun.file(filepath).text();

  const content = parse(rawContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return content.map((row: any) => {
    return {
      category: row.Category,
      resume: row.Resume,
    };
  });
}
