import { mkdir, writeFile } from "node:fs/promises";
import { COURSES } from "../app/courses/courses";
import { getAllCurricula } from "../lib/course-library";
import { editorialFor } from "../lib/course-editorial";
async function main() {
const output = "tmp/pdfs/course-guide-data.json";
const curricula = getAllCurricula();
await mkdir("tmp/pdfs", { recursive: true });
await writeFile(output, JSON.stringify(COURSES.map((course) => ({ course, editorial: editorialFor(course), curriculum: curricula[course.id] })), null, 2), "utf8");
console.log(`Exported ${COURSES.length} course guides to ${output}`);
process.exit(0);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
