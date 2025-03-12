import { readFileSync, writeFileSync } from "fs";
import getAiJsonResponse from "../backend/get-ai-json-response";

// Run this to produce an alternative 'data.ts' file with the best form for each multiform word
export default async () => {
  const originalData = readOriginalData();
  const bestForms = await getBestForms(originalData);
  writeBestForms(bestForms);
}

const readOriginalData = () => {
  return JSON.parse(readFileSync("complete-hsk-vocabulary/complete.min.json", "utf8"));
}

const getBestForms = async (originalData: Array<{
  s: string, q: number, f: Array<{
    i: {
      n: string;
    };
    m: string[];
  }>
}>): Promise<Array<{ c: string; p: string, d: string }>> => {
  const sortedData = originalData.sort((a, b) => a.q - b.q);
  const results: Array<{ c: string, p: string, d: string }> = [];
  for (const { s, f } of sortedData) {
    const bestForm = await (async () => {
      if (f.length == 1) return f[0];
      const prompt = `The word ${s} has multiple forms:\n${f.map((i, ii) => ii.toString() + ": " + i.i.n + " (" + i.m.join(", ") + ")").join("\n")
        }\nWhich form is the most common? Return the selected form in JSON format, i.e. {"mostCommon": 0} where 0 is the index of the form in the list.`;
      const multiformResponse = await getAiJsonResponse<{mostCommon: number}>(
        [{ role: "system", content: `Answer the following query.` },
        { role: "user", content: prompt }]
      );
      if (!multiformResponse.result) {
        console.log(`Word ${s} has multiple forms, but the AI could not answer the question.`);
        return f[0];
      }
      return f[multiformResponse.result.mostCommon];
    })();
    results.push({
      c: s,
      p: bestForm.i.n.replace(" ", "").toLowerCase(),
      d: bestForm.m.join(", "),
    });
  }
  return results;
}

const writeBestForms = (bestForms: Array<{ c: string; p: string, d: string }>) =>
  writeFileSync("frontend/src/data.ts", `export const data: { c: string; p: string, d: string }[] = ${JSON.stringify(bestForms, undefined, 1)};`);
