import { devtools, persist } from "zustand/middleware";
import type { StickyNote } from "../interfaces/StickyNote";
import { create } from "zustand";

type NotesState = {
  notes: StickyNote[];
  pendingDeleteNoteId: string | null;
  lastZIndex: number;
  addNote: (note: StickyNote) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  bringToFront: (id: string) => void;
  setPendingDeleteNoteId: (id: string | null) => void;
};

export const useNotesStore = create<NotesState>()(
  devtools(
    persist(
      (set) => ({
        notes: [],
        pendingDeleteNoteId: null,
        lastZIndex: 0,
        addNote: (note) =>
          set(
            (state) => ({
              notes: [...state.notes, note],
              lastZIndex: Math.max(state.lastZIndex, note.zIndex),
            }),
            false,
            "[Note] addNote",
          ),
        removeNote: (id) =>
          set(
            (state) => ({
              notes: state.notes.filter((note) => note.id !== id),
            }),
            false,
            "[Note] removeNote",
          ),
        updateNote: (id, updates) =>
          set(
            (state) => ({
              notes: state.notes.map((note) =>
                note.id === id ? { ...note, ...updates } : note,
              ),
            }),
            false,
            "[Note] updateNote",
          ),
        bringToFront: (id) =>
          set(
            (state) => {
              const note = state.notes.find((note) => note.id === id);
              if (!note) return state;
              const newZIndex = state.lastZIndex + 1;
              return {
                notes: state.notes.map((note) =>
                  note.id === id ? { ...note, zIndex: newZIndex } : note,
                ),
                lastZIndex: newZIndex,
              };
            },
            false,
            "[Note] bringToFront",
          ),
        setPendingDeleteNoteId: (id) =>
          set(
            { pendingDeleteNoteId: id },
            false,
            "[UI] setPendingDeleteNoteId",
          ),
      }),
      {
        name: "sticky-notes",
        partialize: (state) => ({
          notes: state.notes,
          lastZIndex: state.lastZIndex,
        }),
      },
    ),
  ),
);
