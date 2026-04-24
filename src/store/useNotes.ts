import { devtools, persist } from "zustand/middleware";
import type { StickyNote } from "../interfaces/StickyNote";
import { create } from "zustand";

type NotesState = {
  notes: Record<string, StickyNote>;
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
        notes: {},
        pendingDeleteNoteId: null,
        lastZIndex: 0,
        addNote: (note) =>
          set(
            (state) => ({
              notes: {
                ...state.notes,
                [note.id]: note,
              },
              lastZIndex: Math.max(state.lastZIndex, note.zIndex),
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
              const newZIndex = state.lastZIndex + 1;
              return {
                notes: {
                  ...state.notes,
                  [id]: { ...state.notes[id], zIndex: newZIndex },
                },
                lastZIndex: newZIndex,
              };
            },
            false,
            "[Note] bringToFront",
          ),
        setPendingDeleteNoteId: (id) =>
          set({ pendingDeleteNoteId: id }, false, "[UI] setPendingDeleteNoteId"),
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

