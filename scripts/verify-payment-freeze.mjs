import { existsSync, readFileSync } from "node:fs";

const forbiddenLegacyFiles = [
  "lib/mpesa.ts",
  "app/api/mpesa/callback/route.ts",
  "app/api/mpesa/status/route.ts",
  "app/api/mpesa/stkpush/route.ts",
  "app/courses/[id]/LegacyCoursePage.tsx",
  "app/courses/[id]/PaywallModal.tsx",
];
const existing = forbiddenLegacyFiles.filter(existsSync);
const accessPolicy = readFileSync("lib/access-policy.ts", "utf8");
if (existing.length || !accessPolicy.includes('LEARNING_ACCESS_MODE = "open-preview"')) {
  if (existing.length) console.error(`Legacy payment files must remain absent: ${existing.join(", ")}`);
  if (!accessPolicy.includes('LEARNING_ACCESS_MODE = "open-preview"')) console.error("Learning access must remain open until the Paystack readiness gate is complete.");
  process.exit(1);
}
console.log("Payment guard valid: open-preview access is active and legacy M-Pesa production files are absent.");
