"use client";
import { useEffect, useState } from "react";
import { MAX_NOTE_LENGTH, MAX_NOTES, NOTES_KEY, normalizeNoteBody, parseNotes, readLocalValue, writeLocalValue } from "@/lib/learning-storage";

export function NoteEditor({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const [body, setBody] = useState("");
  const [savedAt, setSavedAt] = useState<string>();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    const note = parseNotes(readLocalValue(NOTES_KEY)).find((item) => item.courseId === courseId && item.lessonId === lessonId);
    setBody(note?.body ?? "");
    setSavedAt(note?.updatedAt);
    setStatus("idle");
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
  }

  function remove() {
    if (body && !window.confirm("Delete this note from this device?")) return;
    const notes = parseNotes(readLocalValue(NOTES_KEY)).filter((note) => !(note.courseId === courseId && note.lessonId === lessonId));
    if (!writeLocalValue(NOTES_KEY, JSON.stringify(notes))) return setStatus("error");
    setBody("");
    setSavedAt(undefined);
    setStatus("saved");
  }

  return <section className="note-editor" aria-labelledby="personal-note-title">
    <div className="note-heading"><div><p className="eyebrow">Personal study note</p><h2 id="personal-note-title">Your notes</h2></div><span>Saved on this device</span></div>
    <label htmlFor="lesson-note">Notes for this lesson</label>
    <textarea id="lesson-note" value={body} maxLength={MAX_NOTE_LENGTH} onChange={(event) => { setBody(event.target.value); setStatus("idle"); }} placeholder="Record an explanation in your own words, a question to revisit, or a practical example." />
    <div className="note-actions"><button type="button" className="button primary" onClick={save}>Save note</button><button type="button" className="button quiet" onClick={remove} disabled={!body}>Delete</button><small>{body.length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}</small><small aria-live="polite">{status === "error" ? "Could not save. Check browser storage settings and available space." : status === "saved" ? "Saved." : savedAt ? `Last saved ${new Date(savedAt).toLocaleString()}` : "No saved note yet."}</small></div>
  </section>;
}
