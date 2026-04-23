import { devtools, persist } from "zustand/middleware";
import type { StickyNote } from "../interfaces/StickyNote";
import { create } from "zustand";

type NotesState = {
    notes: Record<string, StickyNote>;
    addNote: (note: StickyNote) => void;
    removeNote: (note: StickyNote) => void;
};


export const useNotesStore = create<NotesState>()(
    devtools(
        persist(
            (set) => ({
                notes: {},
                addNote: (note) =>
                    set(
                        (state) => ({
                            notes: {
                                ...state.notes,
                                [note.id]: note,
                            },
                        }),
                        false,
                        "[Note] addNote",
                    ),
                removeNote: (note) =>
                    set(
                        (state) => {
                            const { [note.id]: _, ...rest } = state.notes;
                            return {
                                notes: rest,
                            };
                        },
                        false,
                        "[Note] remove",
                    ),

            }),
            { name: "sticky-notes" }, // saved in localstorage to persist data
        ),
    ),
);
