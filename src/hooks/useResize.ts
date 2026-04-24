import { useRef, useCallback } from "react";
import { useNotesStore } from "../store/useNotes";
import {
  STICKY_NOTE_MIN_HEIGHT,
  STICKY_NOTE_MIN_WIDTH,
} from "../constants/stickyNotes.constants";

/**
 * Custom hook to handle the resizing of a Note.
 * @param id - The unique ID of the Note.
 * @param noteRef - Reference to the Note DOM element.
 */
export function useResize(
  id: string,
  noteRef: React.RefObject<HTMLDivElement | null>,
) {
  const updateNote = useNotesStore((s) => s.updateNote);
  const bringToFront = useNotesStore((s) => s.bringToFront);

  const resizing = useRef(false);
  const initialPosition = useRef({ x: 0, y: 0, w: 0, h: 0 }); // Initial data when starting to resize

  const onStartResizeNote = useCallback(
    (e: React.PointerEvent) => {
      const note = useNotesStore
        .getState()
        .notes.find((note) => note.id === id);

      if (!note) return;

      bringToFront(id);
      resizing.current = true;
      // Store the mouse position and the current size of the Note
      initialPosition.current = {
        x: e.clientX,
        y: e.clientY,
        w: note?.size?.width ?? STICKY_NOTE_MIN_WIDTH,
        h: note?.size?.height ?? STICKY_NOTE_MIN_HEIGHT,
      };

      e.stopPropagation();
    },
    [bringToFront, id],
  );

  /**
   * Executed while the user is resizing the Note.
   */
  const onResizeNote = useCallback(
    (e: React.PointerEvent) => {
      if (!resizing.current || !noteRef.current) return;

      //Check with minHeight and minWidth to avoid resizing too small
      const width = Math.max(
        STICKY_NOTE_MIN_WIDTH,
        initialPosition.current.w + (e.clientX - initialPosition.current.x),
      );
      const height = Math.max(
        STICKY_NOTE_MIN_HEIGHT,
        initialPosition.current.h + (e.clientY - initialPosition.current.y),
      );

      // Update the DOM directly for better performance
      noteRef.current.style.width = `${width}px`;
      noteRef.current.style.height = `${height}px`;
    },
    [noteRef],
  );

  /**
   * Executed when user stops resizing the Note (drop resize handler)
   */
  const onResizeNoteEnd = useCallback(() => {
    if (!resizing.current || !noteRef.current) return;
    resizing.current = false;

    // Get the final size of the DOM element
    const rect = noteRef.current.getBoundingClientRect();
    const note = useNotesStore.getState().notes.find((note) => note.id === id);

    if (!note) return;

    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    // update only if size has changed
    if (note?.size?.width !== width || note?.size?.height !== height) {
      updateNote(id, {
        size: { width, height },
      });
    }
  }, [id, updateNote, noteRef]);

  return { onStartResizeNote, onResizeNote, onResizeNoteEnd };
}
