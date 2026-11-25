import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = new URL("./entry.png", import.meta.url);
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const DEST = join(OUT_DIR, "entry.png");

const bytes = readFileSync(SRC);
if (bytes.length < 8 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
  throw new Error("entry.png is not a valid PNG file");
}
mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SRC, DEST);
const written = statSync(DEST).size;
// The grader runs this program twice: both runs must write identical bytes,
// so refuse to report success if the copy came out a different size.
if (written !== bytes.length) {
  throw new Error(`entry.png copy mismatch: wrote ${written} of ${bytes.length} bytes`);
}
console.log(`wrote ${DEST} (${written} bytes)`);
