"use client";
import { useEffect, useState } from "react";
import { MAX_NOTE_LENGTH, MAX_NOTES, NOTES_KEY, normalizeNoteBody, parseNotes, readLocalValue, writeLocalValue } from "@/lib/learning-storage";

export function NoteEditor({ courseId, lessonId, lessonTitle }: { courseId: string; lessonId: string; lessonTitle?: string }) {
  const [body, setBody] = useState("");
  const [savedAt, setSavedAt] = useState<string>();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const note = parseNotes(readLocalValue(NOTES_KEY)).find((item) => item.courseId === courseId && item.lessonId === lessonId);
    setBody(note?.body ?? "");
    setSavedAt(note?.updatedAt);
    setStatus("idle");
    setDirty(false);
  }, [courseId, lessonId]);

  function save() {
    const normalized = normalizeNoteBody(body);
    const now = new Date().toISOString();
    const next = parseNotes(readLocalValue(NOTES_KEY)).filter((note) => !(note.courseId === courseId && note.lessonId === lessonId));
    if (normalized.trim()) next.unshift({ id: `${courseId}::${lessonId}`, courseId, lessonId, body: normalized, updatedAt: now });
    if (!writeLocalValue(NOTES_KEY, JSON.stringify(next.slice(0, MAX_NOTES)))) return setStatus("error");
    setBody(normalized);
    setSavedAt(normalized.trim() ? now : undefined);
    setStatus("saved");
    setDirty(false);
  }

  function download() {
    const text = `# ${lessonTitle ?? "Lesson notes"}\n\nCourse: ${courseId}\nLesson: ${lessonId}\n\n${body}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${lessonId}-notes.md`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function remove() {
    if (body && !window.confirm("Delete this note from this device?")) return;
    const notes = parseNotes(readLocalValue(NOTES_KEY)).filter((note) => !(note.courseId === courseId && note.lessonId === lessonId));
    if (!writeLocalValue(NOTES_KEY, JSON.stringify(notes))) return setStatus("error");
    setBody("");
    setSavedAt(undefined);
    setStatus("saved");
    setDirty(false);
  }

  return <section className="note-editor" aria-labelledby="personal-note-title">
    <div className="note-heading"><div><p className="eyebrow">Personal study note</p><h2 id="personal-note-title">Your notes</h2></div><span>Saved on this device</span></div>
    <label htmlFor="lesson-note">Notes for this lesson</label>
    <p className="note-help">Keep the input, expected result, actual result and what you changed. Save before leaving this lesson. Download a copy to keep it outside this browser.</p>
    {!body ? <button type="button" className="button quiet note-template" onClick={() => { setBody("My explanation:\n\nPractice input:\n\nExpected result:\n\nActual result:\n\nWhat I changed and why:\n\nQuestion to revisit:\n"); setDirty(true); }}>Use practice note template</button> : null}
    <textarea id="lesson-note" value={body} maxLength={MAX_NOTE_LENGTH} onChange={(event) => { setBody(event.target.value); setStatus("idle"); setDirty(true); }} placeholder="Record an explanation in your own words, a question to revisit, or a practical example." />
    <div className="note-export"><button type="button" className="button quiet" onClick={download} disabled={!body.trim()}>Download notes (.md)</button><span role="status">{dirty ? "Unsaved changes — save before leaving." : ""}</span></div>
    <div className="note-actions"><button type="button" className="button primary" onClick={save}>Save note</button><button type="button" className="button quiet" onClick={remove} disabled={!body}>Delete</button><small>{body.length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}</small><small aria-live="polite">{status === "error" ? "Could not save. Check browser storage settings and available space." : status === "saved" ? "Saved." : savedAt ? `Last saved ${new Date(savedAt).toLocaleString()}` : "No saved note yet."}</small></div>
  </section>;
}
