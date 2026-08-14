"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";

// ── Leitner scheduling ───────────────────────────────────────────────────────
// Five boxes. A correct answer promotes a card to the next box and pushes its
// next review further out; a miss sends it back to box 1. Intervals are the
// classic Leitner spacing (immediate → 1 → 3 → 7 → 16 days).
const DAY = 86_400_000;
const BOX_INTERVALS = [0, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY]; // index = box-1
const BOX_COLORS = ["#E11D48", "#EA580C", "#D97706", "#0284C7", "#16A34A"];
const MAX_BOX = 5;

type Grade = "missed" | "almost" | "got";
type CardState = { box: number; due: number; seen: number; correct: number };
type Store = { cards: Record<string, CardState>; streak: number; lastDay: string };

const STORAGE_KEY = "digilearn_practice_v1";

// ── Decks ─────────────────────────────────────────────────────────────────────
// Hand-written, factually checked. Front = prompt, back = answer.
type Card = { q: string; a: string };
type Deck = { id: string; name: string; icon: string; color: string; blurb: string; cards: Card[] };

const DECKS: Deck[] = [
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    icon: "🧠",
    color: "#7C3AED",
    blurb: "Techniques for getting reliable output from LLMs.",
    cards: [
      { q: "What is zero-shot prompting?", a: "Asking a model to perform a task from an instruction alone, with no worked examples — relying on knowledge it learned during pre-training." },
      { q: "What is few-shot prompting?", a: "Including a handful of example input→output pairs in the prompt so the model infers the pattern and applies it to a new input." },
      { q: "What does chain-of-thought prompting do?", a: "It asks the model to reason step by step before answering, which improves accuracy on multi-step problems by making the intermediate steps explicit." },
      { q: "In sampling, what does a higher temperature do?", a: "It flattens the probability distribution over the next token, increasing randomness and diversity. Lower temperature makes output more focused and deterministic." },
      { q: "What is top-p (nucleus) sampling?", a: "The model samples only from the smallest set of tokens whose cumulative probability exceeds p (e.g. 0.9), cutting off the unlikely long tail." },
      { q: "What is retrieval-augmented generation (RAG)?", a: "Retrieving relevant documents from an external source and adding them to the prompt so the model grounds its answer in that context instead of parametric memory alone." },
      { q: "What is a system prompt?", a: "A high-level instruction that sets the model's role, constraints, and behaviour for the whole conversation, separate from individual user turns." },
      { q: "Name a practical way to reduce hallucinations in a prompt.", a: "Instruct the model to answer only from provided context and to say \"I don't know\" when the answer isn't present — ideally grounded with retrieval and citations." },
    ],
  },
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    color: "#16A34A",
    blurb: "Core language mechanics every Python dev should know.",
    cards: [
      { q: "What is the difference between a list and a tuple?", a: "Lists are mutable and written with []; tuples are immutable and written with (). Because tuples are hashable, they can be dict keys or set members — lists cannot." },
      { q: "What does a list comprehension do? Give an example.", a: "It builds a list from an iterable in one expression. e.g. [x*x for x in range(5)] → [0, 1, 4, 9, 16]." },
      { q: "Difference between `is` and `==` in Python?", a: "`==` compares values (equality); `is` compares identity — whether two names point to the exact same object in memory." },
      { q: "What does `if __name__ == \"__main__\":` do?", a: "It runs the guarded block only when the file is executed directly, not when it is imported as a module." },
      { q: "How do you safely read a value from a dict that may be missing the key?", a: "Use dict.get(key, default) — it returns the default instead of raising a KeyError when the key is absent." },
      { q: "Difference between list.append() and list.extend()?", a: "append(x) adds x as a single element; extend(iterable) adds each element of the iterable individually." },
      { q: "What does the `with` statement do when opening a file?", a: "It uses the file as a context manager so it is closed automatically at the end of the block, even if an exception is raised." },
      { q: "How are exceptions handled in Python?", a: "With try/except, optionally followed by else (runs if no exception) and finally (always runs). Risky code goes in try; the handler in except." },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "⚡",
    color: "#EA580C",
    blurb: "Modern JS fundamentals and async behaviour.",
    cards: [
      { q: "Difference between let, const, and var?", a: "var is function-scoped and hoisted; let and const are block-scoped. const cannot be reassigned (though a referenced object can still mutate)." },
      { q: "What does === do that == does not?", a: "=== is strict equality: it compares value and type with no coercion. == coerces types before comparing, which can give surprising results." },
      { q: "What is a Promise?", a: "An object representing the eventual result of an async operation. It is pending, then either fulfilled or rejected; you handle it with .then/.catch or await." },
      { q: "What does Array.prototype.map() return?", a: "A new array holding the result of calling the callback on every element. It does not mutate the original array." },
      { q: "What is a closure?", a: "A function together with references to its surrounding lexical scope, letting it access variables from where it was defined even after that outer function has returned." },
      { q: "Difference between null and undefined?", a: "undefined means a variable was declared but never assigned a value; null is an explicit assignment meaning \"no value\"." },
      { q: "What do async/await do?", a: "`async` marks a function that returns a Promise; `await` pauses inside it until a Promise settles, letting you write async code that reads synchronously." },
      { q: "What does the spread operator (...) do with arrays?", a: "It expands an iterable into individual elements — e.g. [...a, ...b] concatenates, and [...a] makes a shallow copy." },
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: "🔐",
    color: "#E11D48",
    blurb: "Foundational security concepts and common attacks.",
    cards: [
      { q: "What are the three pillars of the CIA triad?", a: "Confidentiality, Integrity, and Availability — the core goals of information security." },
      { q: "What is phishing?", a: "A social-engineering attack that tricks people into revealing credentials or running malware, usually via deceptive emails, messages, or fake sites impersonating a trusted party." },
      { q: "Difference between symmetric and asymmetric encryption?", a: "Symmetric uses one shared secret key for both encrypt and decrypt (fast, e.g. AES). Asymmetric uses a public/private key pair (e.g. RSA), enabling key exchange and digital signatures." },
      { q: "What is SQL injection, and how is it prevented?", a: "Injecting malicious SQL through unvalidated input so the database executes it. Prevented with parameterized queries / prepared statements." },
      { q: "What is multi-factor authentication (MFA)?", a: "Requiring two or more independent factors — something you know, have, or are — so a stolen password alone is not enough to log in." },
      { q: "What does the principle of least privilege mean?", a: "Granting each user, process, or system only the minimum access it needs, limiting the damage from a compromise or mistake." },
      { q: "Why store salted password hashes instead of the passwords?", a: "Hashing is one-way, and a unique salt per user defeats precomputed (rainbow-table) attacks — so a database breach doesn't directly reveal the plaintext passwords." },
      { q: "What is cross-site scripting (XSS)?", a: "A web flaw where an attacker injects malicious scripts into pages other users view. Mitigated by escaping/encoding output and a Content Security Policy." },
    ],
  },
  {
    id: "ai-foundations",
    name: "AI Foundations",
    icon: "🤖",
    color: "#0284C7",
    blurb: "Machine-learning and LLM concepts from the ground up.",
    cards: [
      { q: "What is supervised learning?", a: "Training a model on labelled examples (input → known output) so it learns to predict the label for new, unseen inputs." },
      { q: "How does unsupervised learning differ from supervised?", a: "Unsupervised learning finds structure — clusters or patterns — in unlabelled data, whereas supervised learning maps inputs to known labels." },
      { q: "Difference between training and inference?", a: "Training adjusts the model's parameters from data; inference uses the already-trained model to make predictions on new inputs." },
      { q: "What is overfitting?", a: "When a model fits the training data too closely — including its noise — and so performs well on training data but poorly on new data. Countered with more data, regularization, or a simpler model." },
      { q: "What is gradient descent?", a: "An optimization method that repeatedly nudges parameters in the direction that lowers the loss, using the gradient (slope) of the loss function." },
      { q: "What is a token in the context of LLMs?", a: "A chunk of text — often a word or sub-word piece — that the model processes as a single unit. Text is split into tokens before being fed to the model." },
      { q: "What is a large language model (LLM)?", a: "A neural network (usually a transformer) trained on large text corpora to predict the next token, which lets it generate and understand natural language." },
      { q: "What is the transformer architecture known for?", a: "Using self-attention to process sequence elements in parallel and capture long-range dependencies. It underlies modern LLMs." },
    ],
  },
  {
    id: "git",
    name: "Git & Version Control",
    icon: "🌿",
    color: "#D97706",
    blurb: "The everyday commands and ideas behind Git.",
    cards: [
      { q: "What does `git commit` do?", a: "It records a snapshot of the currently staged changes into the repository's history, with a message describing them. Nothing leaves your machine until you push." },
      { q: "What is the staging area (the index)?", a: "A middle step where you assemble exactly which changes go into the next commit, using `git add`. It lets you commit some edits while leaving others out." },
      { q: "Difference between `git fetch` and `git pull`?", a: "`git fetch` downloads new commits from the remote without touching your working branch. `git pull` is a fetch followed by a merge (or rebase) into your current branch." },
      { q: "What is a merge conflict?", a: "When the same lines were changed differently on two branches, Git can't combine them automatically and marks the spot for you to resolve manually, then commit the resolution." },
      { q: "How does `git rebase` differ from `git merge`?", a: "Merge keeps both histories and adds a merge commit. Rebase re-applies your commits on top of another branch for a linear history — but it rewrites your commit hashes." },
      { q: "What's the difference between `git reset` and `git revert`?", a: "`git revert` adds a new commit that undoes an earlier one (safe on shared history). `git reset` moves the branch pointer and can discard commits — it rewrites history, risky when shared." },
      { q: "What does `git stash` do?", a: "It sets your uncommitted changes aside on a stack and gives you a clean working directory, so you can switch tasks. `git stash pop` brings them back." },
      { q: "What is a `.gitignore` file?", a: "A list of path patterns Git should not track — build output, secrets, dependencies like node_modules. Note it doesn't untrack files that are already committed." },
    ],
  },
  {
    id: "sql",
    name: "SQL",
    icon: "🗄️",
    color: "#0369A1",
    blurb: "Query and model data in relational databases.",
    cards: [
      { q: "What do SELECT and WHERE do?", a: "SELECT chooses which columns to return; WHERE filters which rows come back based on a condition. e.g. SELECT name FROM users WHERE age >= 18." },
      { q: "Difference between INNER JOIN and LEFT JOIN?", a: "INNER JOIN returns only rows that match in both tables. LEFT JOIN returns every row from the left table, filling NULLs where the right table has no match." },
      { q: "What does GROUP BY do?", a: "It collapses rows that share a value into groups so you can aggregate them with COUNT, SUM, AVG, etc. — e.g. total orders per customer." },
      { q: "Difference between WHERE and HAVING?", a: "WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY. Aggregate functions can appear in HAVING but not in WHERE." },
      { q: "What is a primary key vs a foreign key?", a: "A primary key uniquely identifies each row in its table (unique, non-null). A foreign key references another table's primary key, linking the two and enforcing referential integrity." },
      { q: "What does a database index do?", a: "It's a structure (often a B-tree) that lets the engine find matching rows without scanning the whole table — faster reads, at the cost of extra storage and slightly slower writes." },
      { q: "What is a transaction, and what does ACID mean?", a: "A group of statements that all commit or all roll back as one unit. ACID = Atomicity, Consistency, Isolation, Durability — the guarantees that keep data correct under failures and concurrency." },
      { q: "What's the difference between DELETE and TRUNCATE?", a: "DELETE removes selected rows (with WHERE) and can be rolled back row by row. TRUNCATE quickly empties an entire table, is faster, and usually can't be filtered." },
    ],
  },
  {
    id: "web-http",
    name: "Web & HTTP",
    icon: "🌐",
    color: "#DB2777",
    blurb: "How browsers and servers actually talk.",
    cards: [
      { q: "Difference between HTTP GET and POST?", a: "GET requests data and should be safe and idempotent, with parameters in the URL. POST sends data in the request body to create or change server state, and is not idempotent." },
      { q: "What do status codes 404 and 500 mean?", a: "404 Not Found — the resource doesn't exist. 500 Internal Server Error — the server hit an unexpected error. Broadly, 4xx are client errors and 5xx are server errors." },
      { q: "What is HTTPS and why does it matter?", a: "HTTP over TLS. It encrypts traffic between browser and server so it can't be read or tampered with in transit, and authenticates the server through its certificate." },
      { q: "What is a cookie?", a: "A small piece of data the server stores in the browser and that is sent back on later requests to the same site — commonly for sessions. HttpOnly and Secure flags harden it." },
      { q: "What is CORS?", a: "Cross-Origin Resource Sharing — a browser mechanism using response headers like Access-Control-Allow-Origin to decide whether a page on one origin may call an API on another." },
      { q: "What is the DOM?", a: "The Document Object Model — a live, tree-shaped representation of an HTML page that JavaScript can read and modify to change content, structure, and styling on the fly." },
      { q: "What is an API in web terms?", a: "An Application Programming Interface — a defined contract, often HTTP endpoints returning JSON, that lets one program request data or actions from another." },
      { q: "What roles do the client and server play?", a: "The client (browser) requests and renders pages and handles interaction; the server receives requests, runs logic, talks to databases, and returns responses. They communicate over HTTP." },
    ],
  },
];

const TOTAL_CARDS = DECKS.reduce((n, d) => n + d.cards.length, 0);

// ── Helpers ───────────────────────────────────────────────────────────────────
const keyOf = (deckId: string, i: number) => `${deckId}::${i}`;
const deckOf = (k: string) => DECKS.find((d) => d.id === k.split("::")[0])!;
const cardOf = (k: string) => { const [, i] = k.split("::"); return deckOf(k).cards[Number(i)]; };
const defaultState = (): CardState => ({ box: 1, due: 0, seen: 0, correct: 0 });

function dayStr(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function relativeDue(due: number, now: number) {
  const diff = due - now;
  if (diff <= 0) return "now";
  const days = Math.ceil(diff / DAY);
  if (days === 1) return "in ~1 day";
  return `in ~${days} days`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PracticePage() {
  const [mounted, setMounted] = useState(false);
  const [store, setStore] = useState<Store>({ cards: {}, streak: 0, lastDay: "" });
  const [view, setView] = useState<"decks" | "study" | "done">("decks");
  const [queue, setQueue] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [session, setSession] = useState({ reviewed: 0, got: 0, almost: 0, missed: 0 });

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStore(JSON.parse(raw));
    } catch { /* ignore corrupt storage */ }
  }, []);

  const persist = useCallback((next: Store) => {
    setStore(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const now = Date.now();
  const getState = useCallback((k: string): CardState => store.cards[k] ?? defaultState(), [store]);

  // Every possible card key, once.
  const allKeys = useMemo(() => DECKS.flatMap((d) => d.cards.map((_, i) => keyOf(d.id, i))), []);

  const stats = useMemo(() => {
    let due = 0, mastered = 0, reviews = 0, nextDue = Infinity;
    for (const k of allKeys) {
      const st = store.cards[k] ?? defaultState();
      if (st.due <= now) due++; else nextDue = Math.min(nextDue, st.due);
      if (st.box >= MAX_BOX) mastered++;
      reviews += st.seen;
    }
    return { due, mastered, reviews, nextDue, streak: store.streak };
  }, [store, allKeys, now]);

  const deckStats = useMemo(() => {
    const map: Record<string, { due: number; mastered: number; total: number; nextDue: number }> = {};
    for (const d of DECKS) {
      let due = 0, mastered = 0, nextDue = Infinity;
      d.cards.forEach((_, i) => {
        const st = store.cards[keyOf(d.id, i)] ?? defaultState();
        if (st.due <= now) due++; else nextDue = Math.min(nextDue, st.due);
        if (st.box >= MAX_BOX) mastered++;
      });
      map[d.id] = { due, mastered, total: d.cards.length, nextDue };
    }
    return map;
  }, [store, now]);

  const startSession = useCallback((scopeId: string, ahead: boolean) => {
    const inScope = allKeys.filter((k) => scopeId === "all" || k.startsWith(`${scopeId}::`));
    let picked: string[];
    if (ahead) {
      // Study everything, least-known (lowest box) first.
      picked = [...inScope].sort((a, b) => getState(a).box - getState(b).box);
    } else {
      picked = inScope.filter((k) => getState(k).due <= Date.now())
        .sort((a, b) => getState(a).due - getState(b).due);
    }
    if (picked.length === 0) return;
    setQueue(picked);
    setRevealed(false);
    setSession({ reviewed: 0, got: 0, almost: 0, missed: 0 });
    setView("study");
  }, [allKeys, getState]);

  // Deep link: /practice?deck=<id> jumps straight into that deck (used by the
  // dashboard recall drills). Runs once, after stored progress has loaded.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (!mounted || autoStartedRef.current) return;
    const deckId = new URLSearchParams(window.location.search).get("deck");
    if (deckId && DECKS.some((d) => d.id === deckId)) {
      autoStartedRef.current = true;
      startSession(deckId, (deckStats[deckId]?.due ?? 0) === 0);
    }
  }, [mounted, deckStats, startSession]);

  // Kept free of side effects inside state updaters so a StrictMode double-
  // invoke can never double-count a review or double-write storage.
  const grade = useCallback((result: Grade) => {
    const key = queue[0];
    if (!key) return;
    const ts = Date.now();
    const st = store.cards[key] ?? defaultState();

    let box = st.box;
    if (result === "got") box = Math.min(box + 1, MAX_BOX);
    else if (result === "missed") box = 1;
    // "almost" leaves the box unchanged.
    const due = result === "missed" ? ts : ts + BOX_INTERVALS[box - 1];
    const nextState: CardState = {
      box,
      due,
      seen: st.seen + 1,
      correct: st.correct + (result === "got" ? 1 : 0),
    };

    // Daily streak bookkeeping.
    const today = dayStr(ts);
    let streak = store.streak;
    let lastDay = store.lastDay;
    if (lastDay !== today) {
      streak = lastDay === dayStr(ts - DAY) ? streak + 1 : 1;
      lastDay = today;
    }
    persist({ cards: { ...store.cards, [key]: nextState }, streak, lastDay });

    // A card still due right now (a miss, or an "almost" in box 1) goes to the
    // back of the queue to be re-studied this session.
    const rest = queue.slice(1);
    const next = due <= ts ? [...rest, key] : rest;

    setRevealed(false);
    setSession((s) => ({
      reviewed: s.reviewed + 1,
      got: s.got + (result === "got" ? 1 : 0),
      almost: s.almost + (result === "almost" ? 1 : 0),
      missed: s.missed + (result === "missed" ? 1 : 0),
    }));
    setQueue(next);
    if (next.length === 0) setView("done");
  }, [queue, store, persist]);

  // Keyboard shortcuts during study.
  useEffect(() => {
    if (view !== "study") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setRevealed((r) => !r); }
      else if (revealed && e.key === "1") grade("missed");
      else if (revealed && e.key === "2") grade("almost");
      else if (revealed && e.key === "3") grade("got");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, revealed, grade]);

  const currentKey = queue[0];
  const currentDeck = currentKey ? deckOf(currentKey) : null;
  const currentCard = currentKey ? cardOf(currentKey) : null;
  const currentBox = currentKey ? getState(currentKey).box : 1;

  return (
    <div style={{ minHeight: "100svh", background: "var(--bg)" }}>
      <style>{`
        .fc {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--radius-lg); box-shadow: var(--shadow-md);
          padding: clamp(1.75rem, 5vw, 3rem); min-height: 340px;
          display: flex; flex-direction: column; cursor: pointer;
          transition: box-shadow .2s, transform .2s; text-align: left; width: 100%;
          font-family: inherit; color: inherit;
        }
        .fc:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
        .fc-answer { animation: fc-in .28s ease; }
        @keyframes fc-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .grade-btn {
          flex: 1; min-height: 52px; border-radius: var(--radius-sm); border: 1.5px solid;
          font-family: inherit; font-size: 0.9rem; font-weight: 700; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
          transition: all .15s; background: var(--surface);
        }
        .grade-btn:hover { transform: translateY(-2px); }
        .grade-btn small { font-weight: 500; font-size: 0.62rem; opacity: 0.7; }
        .deck-tile {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 1.5rem; box-shadow: var(--shadow-xs);
          display: flex; flex-direction: column; gap: 0.9rem; transition: all .2s;
        }
        .deck-tile:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <DigiLearnLogo size={28} />
          <span style={{ fontWeight: 800 }}>DigiLearn</span>
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/courses" className="nav-link">Courses</Link>
          <Link href="/practice" className="nav-link active">Practice</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
        </div>
        <Link href="/auth?mode=signup" className="nav-cta">Start free →</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "6rem 1.5rem 5rem" }}>
        {/* ── DECKS VIEW ── */}
        {(view === "decks" || !mounted) && (
          <>
            <div className="section-tag tag-violet" style={{ marginBottom: "1rem" }}>Spaced repetition · Leitner system</div>
            <h1 style={{ fontSize: "clamp(1.9rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>
              Practice &amp; <span className="cyan-text">remember</span>
            </h1>
            <p style={{ color: "var(--text-dim)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 560, marginBottom: "2.25rem" }}>
              Short flashcard drills that schedule themselves. Cards you know slip further into the future; cards you miss come back soon — so your time lands where it matters. Progress is saved on this device.
            </p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "Due now", value: mounted ? stats.due : 0, icon: "⏰", color: "var(--cyan)" },
                { label: `Mastered of ${TOTAL_CARDS}`, value: mounted ? stats.mastered : 0, icon: "🏆", color: "var(--green)" },
                { label: "Day streak", value: mounted ? stats.streak : 0, icon: "🔥", color: "var(--orange)" },
                { label: "Total reviews", value: mounted ? stats.reviews : 0, icon: "🔁", color: "var(--violet)" },
              ].map((s) => (
                <div key={s.label} className="dash-stat-card">
                  <span style={{ fontSize: "1.35rem" }}>{s.icon}</span>
                  <div className="dash-stat-num" style={{ color: s.color }}>{s.value}</div>
                  <div className="dash-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* All-due CTA or caught-up banner */}
            {mounted && stats.due > 0 ? (
              <button onClick={() => startSession("all", false)} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: "2.25rem", fontSize: "0.95rem" }}>
                Review all {stats.due} due card{stats.due > 1 ? "s" : ""} →
              </button>
            ) : mounted ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", padding: "1.25rem 1.5rem", borderRadius: "var(--radius)", background: "var(--green-light)", border: "1px solid rgba(var(--green-rgb),0.25)", marginBottom: "2.25rem" }}>
                <span style={{ fontSize: "1.6rem" }}>✅</span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, color: "var(--green)" }}>You&apos;re all caught up.</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                    {stats.nextDue === Infinity ? "Study a deck below to add cards to your schedule." : `Next review ${relativeDue(stats.nextDue, now)}. Get ahead any time below.`}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Deck grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))", gap: "1.25rem" }}>
              {DECKS.map((d) => {
                const ds = mounted ? deckStats[d.id] : { due: d.cards.length, mastered: 0, total: d.cards.length, nextDue: Infinity };
                const pct = Math.round((ds.mastered / ds.total) * 100);
                return (
                  <div key={d.id} className="deck-tile">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", background: `${d.color}18`, border: `1px solid ${d.color}33`, flexShrink: 0 }}>{d.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{d.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-mute)" }}>{ds.total} cards</div>
                      </div>
                      {mounted && ds.due > 0 && (
                        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--cyan)", background: "var(--cyan-light)", padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>{ds.due} due</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: 1.55, margin: 0 }}>{d.blurb}</p>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-mute)", marginBottom: 5 }}>
                        <span>Mastered</span><span>{ds.mastered}/{ds.total}</span>
                      </div>
                      <div className="progress-wrap">
                        <div className="progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${d.color},${d.color}99)` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => startSession(d.id, mounted ? ds.due === 0 : false)}
                      className={mounted && ds.due === 0 ? "btn-ghost" : "btn-primary"}
                      style={{ justifyContent: "center", padding: "0.6rem", fontSize: "0.82rem", width: "100%", minHeight: 42, boxShadow: "none" }}
                    >
                      {mounted && ds.due === 0 ? "Review ahead" : "Study →"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* How it works — a plain explanation of the method */}
            <div style={{ marginTop: "3.5rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>How this works</h2>
              <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", lineHeight: 1.75, maxWidth: 620, marginBottom: "1.75rem" }}>
                This is the <strong>Leitner system</strong> — a proven, low-effort way to remember more by reviewing at the right moment. You grade yourself honestly, and each card&apos;s next review is scheduled for you.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
                {[
                  { n: "1", title: "Answer, then self-grade", body: "Read the front, recall the answer, flip the card, then tell it the truth: Got it, Almost, or Missed. Honest grading is what makes the schedule work." },
                  { n: "2", title: "Five boxes space it out", body: "Every card lives in a box from 1 to 5. Get it right and it moves up a box, so you see it less often. Miss it and it drops to box 1 to be relearned." },
                  { n: "3", title: "Come back when it's due", body: "Higher boxes wait longer between reviews — roughly 1, 3, 7, then 16 days. You only study what's due, so effort goes where memory is weakest." },
                ].map((s) => (
                  <div key={s.n} className="dash-card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: "var(--violet)", background: "var(--violet-light)" }}>{s.n}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{s.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: 1.6 }}>{s.body}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-mute)", marginRight: 4 }}>Box → review after:</span>
                {[
                  { box: "1", when: "same session", c: BOX_COLORS[0] },
                  { box: "2", when: "~1 day", c: BOX_COLORS[1] },
                  { box: "3", when: "~3 days", c: BOX_COLORS[2] },
                  { box: "4", when: "~7 days", c: BOX_COLORS[3] },
                  { box: "5", when: "~16 days", c: BOX_COLORS[4] },
                ].map((b) => (
                  <span key={b.box} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 600, color: "var(--text-dim)", background: "var(--bg3)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 100 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: b.c }} />
                    Box {b.box} · {b.when}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-mute)", marginTop: "1.5rem", lineHeight: 1.6 }}>
                Your progress is stored only in this browser (localStorage) — nothing is uploaded, and there are no accounts to create.
              </p>
            </div>
          </>
        )}

        {/* ── STUDY VIEW ── */}
        {view === "study" && mounted && currentCard && currentDeck && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 10 }}>
              <button onClick={() => setView("decks")} style={{ background: "none", border: "none", color: "var(--text-mute)", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, fontFamily: "inherit", padding: 0 }}>← End session</button>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>
                {queue.length} card{queue.length > 1 ? "s" : ""} left
              </span>
            </div>

            <button className="fc" onClick={() => setRevealed((r) => !r)} aria-label="Flip card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: currentDeck.color, background: `${currentDeck.color}15`, padding: "3px 10px", borderRadius: 100 }}>{currentDeck.icon} {currentDeck.name}</span>
                <span style={{ marginLeft: "auto", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: BOX_COLORS[currentBox - 1] }}>Box {currentBox}/5</span>
              </div>

              <div style={{ fontSize: "clamp(1.15rem,3vw,1.5rem)", fontWeight: 700, lineHeight: 1.4, color: "var(--text)" }}>
                {currentCard.q}
              </div>

              {revealed ? (
                <div className="fc-answer" style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px dashed var(--border2)" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-mute)", marginBottom: 8 }}>Answer</div>
                  <div style={{ fontSize: "clamp(0.95rem,2.5vw,1.05rem)", lineHeight: 1.7, color: "var(--text-dim)" }}>{currentCard.a}</div>
                </div>
              ) : (
                <div style={{ marginTop: "auto", paddingTop: "1.5rem", color: "var(--text-mute)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1rem" }}>👆</span> Tap the card or press <kbd style={{ fontFamily: "'Fira Code',monospace", background: "var(--bg3)", padding: "1px 6px", borderRadius: 4, fontSize: "0.72rem" }}>Space</kbd> to reveal
                </div>
              )}
            </button>

            {revealed && (
              <div style={{ display: "flex", gap: 10, marginTop: "1.25rem" }}>
                <button className="grade-btn" style={{ borderColor: "rgba(var(--rose-rgb),0.4)", color: "var(--rose)" }} onClick={() => grade("missed")}>
                  Missed <small>1 · back to box 1</small>
                </button>
                <button className="grade-btn" style={{ borderColor: "rgba(var(--amber-rgb),0.45)", color: "var(--amber)" }} onClick={() => grade("almost")}>
                  Almost <small>2 · same box</small>
                </button>
                <button className="grade-btn" style={{ borderColor: "rgba(var(--green-rgb),0.45)", color: "var(--green)" }} onClick={() => grade("got")}>
                  Got it <small>3 · promote</small>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── DONE VIEW ── */}
        {view === "done" && mounted && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
            <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.25rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Session complete</h1>
            <p style={{ color: "var(--text-dim)", marginBottom: "2rem" }}>You reviewed {session.reviewed} card{session.reviewed !== 1 ? "s" : ""}. Nicely done.</p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              {[
                { label: "Got it", value: session.got, color: "var(--green)" },
                { label: "Almost", value: session.almost, color: "var(--amber)" },
                { label: "Missed", value: session.missed, color: "var(--rose)" },
              ].map((s) => (
                <div key={s.label} className="dash-card" style={{ minWidth: 110 }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-mute)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {stats.due > 0 && (
                <button onClick={() => startSession("all", false)} className="btn-primary" style={{ justifyContent: "center" }}>
                  Keep going · {stats.due} due →
                </button>
              )}
              <button onClick={() => setView("decks")} className="btn-ghost">Back to decks</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DigiLearnLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="url(#dl-p-bg)" />
      <circle cx="18" cy="18" r="8" stroke="url(#dl-p-ring)" strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="10" r="2.5" fill="#00D4FF" /><circle cx="10" cy="22" r="2.5" fill="#FF7A00" /><circle cx="26" cy="22" r="2.5" fill="#A855F7" />
      <line x1="18" y1="12.5" x2="12" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="18" y1="12.5" x2="24" y2="20.5" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="12.5" y1="22" x2="23.5" y2="22" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.4" />
      <defs>
        <linearGradient id="dl-p-bg" x1="0" y1="0" x2="36" y2="36"><stop offset="0%" stopColor="#061A24" /><stop offset="100%" stopColor="#050508" /></linearGradient>
        <linearGradient id="dl-p-ring" x1="10" y1="10" x2="26" y2="26"><stop offset="0%" stopColor="#00D4FF" /><stop offset="100%" stopColor="#0077AA" /></linearGradient>
      </defs>
    </svg>
  );
}
