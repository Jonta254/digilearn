"use client";
import { useEffect, useState } from "react";
import { NOTES_KEY, parseNotes } from "@/lib/learning-storage";

export function NoteEditor({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const [body, setBody] = useState("");
  const [savedAt, setSavedAt] = useState<string>();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    const note = parseNotes(localStorage.getItem(NOTES_KEY)).find((item) => item.courseId === courseId && item.lessonId === lessonId);
    setBody(note?.body ?? "");
    setSavedAt(note?.updatedAt);
    setStatus("idle");
  }, [courseId, lessonId]);

  function save() {
    try {
      const notes = parseNotes(localStorage.getItem(NOTES_KEY));
      const now = new Date().toISOString();
      const next = notes.filter((note) => !(note.courseId === courseId && note.lessonId === lessonId));
      if (body.trim()) next.unshift({ id: `${courseId}::${lessonId}`, courseId, lessonId, body: body.slice(0, 12000), updatedAt: now });
      localStorage.setItem(NOTES_KEY, JSON.stringify(next));
      setSavedAt(body.trim() ? now : undefined);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  function remove() {
    if (!body || window.confirm("Delete this note from this device?")) {
      setBody("");
      try {
        const notes = parseNotes(localStorage.getItem(NOTES_KEY)).filter((note) => !(note.courseId === courseId && note.lessonId === lessonId));
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
        setSavedAt(undefined);
        setStatus("saved");
      } catch { setStatus("error"); }
    }
  }

  return <section className="note-editor" aria-labelledby="personal-note-title">
    <div className="note-heading"><div><p className="eyebrow">Personal study note</p><h2 id="personal-note-title">Your notes</h2></div><span>Saved on this device</span></div>
    <label htmlFor="lesson-note">Notes for this lesson</label>
    <textarea id="lesson-note" value={body} maxLength={12000} onChange={(event) => { setBody(event.target.value); setStatus("idle"); }} placeholder="Record an explanation in your own words, a question to revisit, or a practical example." />
    <div className="note-actions"><button type="button" className="button primary" onClick={save}>Save note</button><button type="button" className="button quiet" onClick={remove} disabled={!body}>Delete</button><small aria-live="polite">{status === "error" ? "Could not save. Check browser storage settings." : status === "saved" ? "Saved." : savedAt ? `Last saved ${new Date(savedAt).toLocaleString()}` : "No saved note yet."}</small></div>
  </section>;
}
