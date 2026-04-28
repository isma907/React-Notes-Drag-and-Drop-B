import { describe, it, expect, beforeEach } from "vitest";
import { useNotesStore } from "./useNotes";

describe("useNotesStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useNotesStore.setState({
      notes: {},
      lastZIndex: 0,
      toolbarConfig: { width: 200, height: 200 },
      lastDeletedNote: null,
    });
  });

  it("should update an existing note", () => {
    const { createNote } = useNotesStore.getState();
    createNote({ x: 10, y: 10 });

    let state = useNotesStore.getState();
    const noteId = Object.keys(state.notes)[0];

    // Update the note
    state.updateNote(noteId, { textContent: "Hello AI!" });

    state = useNotesStore.getState();
    expect(state.notes[noteId].textContent).toBe("Hello AI!");
  });

  it("should bring a note to front", () => {
    const { createNote } = useNotesStore.getState();
    createNote({ x: 10, y: 10 });
    createNote({ x: 20, y: 20 });

    let state = useNotesStore.getState();
    const firstNoteId = Object.keys(state.notes)[0];

    expect(state.notes[firstNoteId].zIndex).toBe(1);

    // Bring first note to front
    state.bringToFront(firstNoteId);

    state = useNotesStore.getState();
    expect(state.notes[firstNoteId].zIndex).toBe(3);
    expect(state.lastZIndex).toBe(3);
  });

  it("should remove a note and store it in lastDeletedNote", () => {
    const { createNote } = useNotesStore.getState();
    createNote({ x: 0, y: 0 });

    let state = useNotesStore.getState();
    const noteId = Object.keys(state.notes)[0];

    // Remove note
    state.removeNote(noteId);

    state = useNotesStore.getState();
    expect(Object.keys(state.notes)).toHaveLength(0);
    expect(state.lastDeletedNote?.id).toBe(noteId);
  });

  it("should restore the last deleted note", () => {
    const { createNote, removeNote, restoreNote } = useNotesStore.getState();
    createNote({ x: 0, y: 0 });

    let state = useNotesStore.getState();
    const noteId = Object.keys(state.notes)[0];

    removeNote(noteId);
    restoreNote();

    state = useNotesStore.getState();
    expect(Object.keys(state.notes)).toHaveLength(1);
    expect(state.notes[noteId]).toBeDefined();
    expect(state.lastDeletedNote).toBeNull();
  });
});
