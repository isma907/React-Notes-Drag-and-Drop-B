import { devtools, persist } from "zustand/middleware";
import type {
  StickyNote,
  StickyNotePosition,
  StickyNoteSize,
} from "../interfaces/StickyNote";
import { create } from "zustand";
import {
  STICKY_NOTE_MIN_WIDTH,
  STICKY_NOTE_MIN_HEIGHT,
} from "../constants/stickyNotes.constants";
import { createStickyNote } from "../utils/stickyNotes.utils";

type NotesState = {
  notes: Record<string, StickyNote>;
  createNote: (position: StickyNotePosition) => void;
  toolbarConfig: StickyNoteSize;
  updateToolbarConfig: (updates: Partial<StickyNoteSize>) => void;

  lastZIndex: number;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  bringToFront: (id: string) => void;

  lastDeletedNote: StickyNote | null;
  restoreNote: () => void;
  clearDeletedNote: () => void;
};

export const useNotesStore = create<NotesState>()(
  devtools(
    persist(
      (set) => ({
        notes: {},
        createNote: (position) => {
          set(
            (state) => {
              const newNote = createStickyNote(
                state.toolbarConfig,
                position,
                state.lastZIndex + 1,
              );
              return {
                notes: { ...state.notes, [newNote.id]: newNote },
                lastZIndex: state.lastZIndex + 1,
              };
            },
            false,
            "[Note] createNote",
          );
        },
        lastZIndex: 0,
        toolbarConfig: {
          width: STICKY_NOTE_MIN_WIDTH,
          height: STICKY_NOTE_MIN_HEIGHT,
        },
        updateToolbarConfig: (updates) =>
          set(
            (state) => ({
              toolbarConfig: { ...state.toolbarConfig, ...updates },
            }),
            false,
            "[Note] updateToolbarConfig",
          ),
        lastDeletedNote: null,
        removeNote: (id) =>
          set(
            (state) => {
              const noteToDelete = state.notes[id];
              if (!noteToDelete) return state;

              const newNotes = { ...state.notes };
              delete newNotes[id];

              return {
                notes: newNotes,
                lastDeletedNote: noteToDelete,
              };
            },
            false,
            "[Note] removeNote",
          ),
        restoreNote: () =>
          set(
            (state) => {
              if (!state.lastDeletedNote) return state;
              return {
                notes: {
                  ...state.notes,
                  [state.lastDeletedNote.id]: state.lastDeletedNote,
                },
                lastDeletedNote: null,
              };
            },
            false,
            "[Note] restoreNote",
          ),
        clearDeletedNote: () =>
          set({ lastDeletedNote: null }, false, "[Note] clearDeletedNote"),
        updateNote: (id, updates) =>
          set(
            (state) => {
              if (!state.notes[id]) return state;
              return {
                notes: {
                  ...state.notes,
                  [id]: { ...state.notes[id], ...updates },
                },
              };
            },
            false,
            "[Note] updateNote",
          ),
        // Increments the z-index of the Note to move it to the front
        bringToFront: (id) =>
          set(
            (state) => {
              if (!state.notes[id]) return state;
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
      }),
      {
        name: "sticky-notes", // Key name in localStorage
        // partialize to avoid saving temporary states on localStorage
        partialize: (state) => ({
          toolbarConfig: state.toolbarConfig,
          notes: state.notes,
          lastZIndex: state.lastZIndex,
        }),
      },
    ),
  ),
);
