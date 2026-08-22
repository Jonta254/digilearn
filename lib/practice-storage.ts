export type PracticeCardState = { box: number; due: number; seen: number; correct: number };
export type PracticeStore = { cards: Record<string, PracticeCardState>; streak: number; lastDay: string };

const EMPTY: PracticeStore = { cards: {}, streak: 0, lastDay: "" };
function boundedInteger(value: unknown, minimum: number, maximum: number, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, Math.trunc(value))) : fallback;
}
export function parsePracticeStore(raw: string | null, allowedKeys: ReadonlySet<string>): PracticeStore {
  if (!raw || raw.length > 1_000_000) return EMPTY;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    if (!value || typeof value !== "object" || Array.isArray(value)) return EMPTY;
    const cardsValue = value.cards && typeof value.cards === "object" && !Array.isArray(value.cards) ? value.cards as Record<string, unknown> : {};
    const cards: Record<string, PracticeCardState> = Object.create(null) as Record<string, PracticeCardState>;
    for (const [key, stateValue] of Object.entries(cardsValue)) {
      if (!allowedKeys.has(key) || !stateValue || typeof stateValue !== "object" || Array.isArray(stateValue)) continue;
      const state = stateValue as Record<string, unknown>;
      cards[key] = { box: boundedInteger(state.box, 1, 5, 1), due: boundedInteger(state.due, 0, 4_102_444_800_000), seen: boundedInteger(state.seen, 0, 1_000_000), correct: boundedInteger(state.correct, 0, 1_000_000) };
    }
    return { cards, streak: boundedInteger(value.streak, 0, 100_000), lastDay: typeof value.lastDay === "string" && /^\d{4}-\d{1,2}-\d{1,2}$/.test(value.lastDay) ? value.lastDay : "" };
  } catch { return EMPTY; }
}
