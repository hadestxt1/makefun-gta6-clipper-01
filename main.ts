// gta6-clipper-01 entry (Node 22, standard library only): the entry is the
// YouTube clip itself. This program hands the gate the video's address: it
// copies VIDEO.json from the repository root to /output/VIDEO.json, where the
// gate reads it. Nothing this program writes about the video is scored.
//
// The clip: a vertical cut of Rockstar's Grand Theft Auto VI Trailer 2 —
// the Vice City getaway chase (trailer 2:24-2:32), then make.fun's pitch on
// screen — uploaded public to YouTube by the entrant as a Short, its
// description carrying the bounty's line and the account's play code.
// VIDEO.json holds the video's address once it is uploaded.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'VIDEO.json');
const target = join(OUTPUT_DIR, 'VIDEO.json');

let raw: Buffer;
try {
  raw = readFileSync(source);
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

let video: unknown;
try {
  video = JSON.parse(raw.toString('utf8'));
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof video !== 'object' || video === null || typeof (video as { url?: unknown }).url !== 'string') {
  console.error('VIDEO.json must hold an object with a string "url" field');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(target, raw);
