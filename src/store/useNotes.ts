import { devtools, persist } from "zustand/middleware";
import type { StickyNote } from "../interfaces/StickyNote";
import { create } from "zustand";

type NotesState = {
  notes: Record<string, StickyNote>;
  noteOrder: string[];
  addNote: (note: StickyNote) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  bringToFront: (id: string) => void;
};

export const useNotesStore = create<NotesState>()(
  devtools(
    persist(
      (set) => ({
        notes: {},
        noteOrder: [],
        addNote: (note) =>
          set(
            (state) => ({
              notes: {
                ...state.notes,
                [note.id]: note,
              },
              noteOrder: [...state.noteOrder, note.id],
            }),
            false,
            "[Note] addNote",
          ),
        removeNote: (id) =>
          set(
            (state) => {
              const notes = Object.fromEntries(
                Object.entries(state.notes).filter(([key]) => key !== id),
              );
              return {
                notes,
                noteOrder: state.noteOrder.filter((noteId) => noteId !== id),
              };
            },
            false,
            "[Note] removeNote",
          ),
        updateNote: (id, updates) =>
          set(
            (state) => ({
              notes: {
                ...state.notes,
                [id]: { ...state.notes[id], ...updates },
              },
            }),
            false,
            "[Note] updateNote",
          ),
        bringToFront: (id) =>
          set(
            (state) => {
              if (!state.notes[id]) {
                return state;
              }

              if (state.noteOrder[state.noteOrder.length - 1] === id) {
                return state;
              }

              return {
                notes: state.notes,
                noteOrder: [
                  ...state.noteOrder.filter((noteId) => noteId !== id),
                  id,
                ],
              };
            },
            false,
            "[Note] bringToFront",
          ),
      }),
      { name: "sticky-notes" }, // saved in localstorage to persist data
    ),
  ),
);
