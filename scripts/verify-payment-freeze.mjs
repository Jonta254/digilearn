import { execFileSync } from "node:child_process";

const baseline = "0c47f6d";
const protectedFiles = [
  ".env.example",
  "lib/mpesa.ts",
  "lib/pricing.ts",
  "app/api/mpesa/callback/route.ts",
  "app/api/mpesa/status/route.ts",
  "app/api/mpesa/stkpush/route.ts",
  "lib/access-policy.ts",
  "app/courses/[id]/LegacyCoursePage.tsx",
  "app/courses/[id]/PaywallModal.tsx",
];
try {
  execFileSync("git", ["diff", "--quiet", baseline, "--", ...protectedFiles], { stdio: "inherit" });
  console.log(`Payment freeze valid: ${protectedFiles.length} protected files match ${baseline}.`);
} catch {
  console.error(`Payment freeze failed: protected files differ from ${baseline}.`);
  process.exit(1);
}
