import { devtools, persist } from "zustand/middleware";
import type { StickyNote } from "../interfaces/StickyNote";
import { create } from "zustand";

type NotesState = {
  notes: StickyNote[];
  lastZIndex: number;
  addNote: (note: StickyNote) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  bringToFront: (id: string) => void;

  deleteNoteId: string | null;
  isDeleteModalOpen: boolean;
  showDeleteNoteModal: (id: string) => void;
  hideDeleteNoteModal: () => void;
};

export const useNotesStore = create<NotesState>()(
  devtools(
    persist(
      (set) => ({
        notes: [],
        deleteNoteId: null,
        lastZIndex: 0,
        addNote: (note) =>
          set(
            (state) => ({
              notes: [...state.notes, note],
              // Ensure to update lastZIndex on adding new Note
              lastZIndex: Math.max(state.lastZIndex, note.zIndex),
            }),
            false,
            "[Note] addNote",
          ),
        removeNote: (id) =>
          set(
            (state) => ({
              notes: state.notes.filter((note) => note.id !== id),
              deleteNoteId: null,
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
        // Increments the z-index of the Note to move it to the front
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
        // Control state for delete confirmation modal Note id
        isDeleteModalOpen: false,
        showDeleteNoteModal: (id) =>
          set(
            { isDeleteModalOpen: true, deleteNoteId: id },
            false,
            "[UI] showDeleteNoteModal",
          ),
        hideDeleteNoteModal: () =>
          set(
            { isDeleteModalOpen: false, deleteNoteId: null },
            false,
            "[UI] hideDeleteNoteModal",
          ),
      }),
      {
        name: "sticky-notes", // Key name in localStorage
        // partialize to avoid saving temporary states on localStorage like pendingDeleteNoteId
        partialize: (state) => ({
          notes: state.notes,
          lastZIndex: state.lastZIndex,
        }),
      },
    ),
  ),
);
