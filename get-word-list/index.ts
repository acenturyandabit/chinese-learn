import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import aiFilterMultiformWords from './ai-filter-multiform-words';

const main = async () => {
  const FORCE_CLONE = process.argv.includes('-p');

  if (!existsSync('frontend')) {
    console.error('please run this script in the root directory of the project');
    process.exit(1);
  }

  if (!existsSync('complete-hsk-vocabulary') || FORCE_CLONE) {
    execSync('git clone https://github.com/drkameleon/complete-hsk-vocabulary.git');
  }

  const dataFilePath = join('frontend', 'src', 'data.ts');
  writeFileSync(dataFilePath, 'export const data: { c: string; p: string, d: string }[] = [\n');

  const jqCommand = `jq 'sort_by(.q) | .[] | {c:.s, p:.f[0].i.n | sub(" ";"";"g") | ascii_downcase, d: (.f[0].m | join(", "))}' complete-hsk-vocabulary/complete.min.json >> ${dataFilePath}`;
  execSync(jqCommand);

  execSync(`sed -i s/^}/},/g ${dataFilePath}`);
  writeFileSync(dataFilePath, '];\n', { flag: 'a' });

  await aiFilterMultiformWords();
  deleteSpacesFromWords();
}

const deleteSpacesFromWords = () => {
  const originalData = JSON.parse("["+readFileSync("frontend/src/data.ts").toString().split("\n").slice(1).join("\n").slice(0, -1));
  writeFileSync("frontend/src/data.ts", `export const data: { c: string; p: string, d: string }[] = ${JSON.stringify(
    originalData.map(d => ({ ...d, p: d.p.replace(" ", "").toLowerCase() }))    
    , undefined, 1)};`);
}

main();
