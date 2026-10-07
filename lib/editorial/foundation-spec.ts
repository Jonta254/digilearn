import type { KnowledgeCheck, SourceReference } from "../learning-types";
export type FoundationSpec = {
  title: string; intro: string; explanation: string; code: string; output: string;
  terms: string[]; objectives: [string, string, string]; steps: [string, string, string];
  activity: string; mistakes: [string, string, string]; summary: [string, string, string];
  check: KnowledgeCheck; nodes: [string, string, string]; source: SourceReference;
};
export const pythonSource = (title: string, path: string): SourceReference => ({ title, organization: "Python Software Foundation", url: `https://docs.python.org/3/${path}`, accessed: "2026-10-07" });
export const sqlSource = (title: string, page: string): SourceReference => ({ title, organization: "PostgreSQL Global Development Group", url: `https://www.postgresql.org/docs/current/${page}.html`, accessed: "2026-10-07" });
