import { rmSync } from "node:fs";
import { basename, resolve } from "node:path";

const generated = resolve(process.cwd(), ".next");
if (basename(generated) !== ".next") throw new Error(`Refusing to clean unexpected path: ${generated}`);
rmSync(generated, { recursive: true, force: true });
console.log("Removed generated Next.js output.");
