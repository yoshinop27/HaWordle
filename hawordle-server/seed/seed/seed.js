import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

// set up paths
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// make words readable or empty if not a word
const toNFC = (s) => (s ?? '').normalize('NFC');
// split into array of chars
const graphemes = (s) => Array.from(toNFC(s));

async function main() {
  // read file
  const file = path.join(__dirname, 'words.csv');
  const rows = fs.readFileSync(file, 'utf8').split("\n").filter(Boolean);

  let added = 0;
  for (const line of rows) {
    // break up each row into parts in array
    const [rawWord, isAnswerStr, gloss] = line.split(',').map(s => (s ?? '').trim());
    // make sure non null
    if (!rawWord) continue;
    const word = toNFC(rawWord);
    const isAnswer = (isAnswerStr || '').toLowerCase() === 'true';

    //check length
    if (graphemes(word).length !== 5) { console.warn('Skip (not 5):', word); continue; }

    // updating or inserting rows into db
    await prisma.word.upsert({
      where: { word },
      update: { isAnswer, gloss: gloss || null, length: 5 },
      create: { word, isAnswer, gloss: gloss || null, length: 5 }
    });
    added++;
  }
  console.log(`Seeded ${added} words`);
}
// run main and close connnection to db
main().finally(async () => prisma.$disconnect());
