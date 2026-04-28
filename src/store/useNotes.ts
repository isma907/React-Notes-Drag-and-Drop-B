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
  notes: StickyNote[];
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
        notes: [],
        createNote: (position) => {
          set(
            (state) => ({
              notes: [
                ...state.notes,
                createStickyNote(
                  state.toolbarConfig,
                  position,
                  state.lastZIndex + 1,
                ),
              ],
              lastZIndex: state.lastZIndex + 1,
            }),
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
              const noteToDelete = state.notes.find((n) => n.id === id);
              return {
                notes: state.notes.filter((note) => note.id !== id),
                lastDeletedNote: noteToDelete || null,
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
                notes: [...state.notes, state.lastDeletedNote],
                lastDeletedNote: null,
              };
            },
            false,
            "[Note] restoreNote",
          ),
        clearDeletedNote: () =>
          set(
            { lastDeletedNote: null },
            false,
            "[Note] clearDeletedNote",
          ),
        updateNote: (id, updates) =>
          set(
            (state) => {
              const index = state.notes.findIndex((n) => n.id === id);
              if (index === -1) return state;
              const newNotes = [...state.notes];
              newNotes[index] = { ...newNotes[index], ...updates };
              return { notes: newNotes };
            },
            false,
            "[Note] updateNote",
          ),
        // Increments the z-index of the Note to move it to the front
        bringToFront: (id) =>
          set(
            (state) => {
              const index = state.notes.findIndex((n) => n.id === id);
              if (index === -1) return state;
              const newZIndex = state.lastZIndex + 1;
              const newNotes = [...state.notes];
              newNotes[index] = { ...newNotes[index], zIndex: newZIndex };
              return {
                notes: newNotes,
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
