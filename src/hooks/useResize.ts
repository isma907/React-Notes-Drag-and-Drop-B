import { useRef, useCallback } from "react";
import { useNotesStore } from "../store/useNotes";
import {
  STICKY_NOTE_MAX_WIDTH,
  STICKY_NOTE_MIN_HEIGHT,
  STICKY_NOTE_MIN_WIDTH,
} from "../constants/stickyNotes.constants";
import type { StickyNoteRect } from "../interfaces/StickyNote";

/**
 * Custom hook to handle the resizing of a Note.
 * @param id - The unique ID of the Note.
 * @param noteRef - Reference to the Note DOM element.
 */
export function useResize(
  id: string,
  noteRef: React.RefObject<HTMLDivElement | null>,
  boardRef: React.RefObject<HTMLDivElement | null>,
) {
  const updateNote = useNotesStore((s) => s.updateNote);
  const bringToFront = useNotesStore((s) => s.bringToFront);

  const resizing = useRef(false);
  const initialPosition = useRef<StickyNoteRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }); // Initial data when starting to resize

  const onStartResizeNote = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return; // pressed left click only
      const note = useNotesStore.getState().notes[id];

      if (!note) return;

      bringToFront(id);
      resizing.current = true;
      // Store the mouse position and the current size of the Note
      initialPosition.current = {
        x: e.clientX,
        y: e.clientY,
        width: note?.size?.width ?? STICKY_NOTE_MIN_WIDTH,
        height: note?.size?.height ?? STICKY_NOTE_MIN_HEIGHT,
      };

      // Capture the pointer so movement is detected even if it leaves the Note
      e.currentTarget.setPointerCapture(e.pointerId);
      e.stopPropagation();
    },
    [bringToFront, id],
  );

  /**
   * Executed while the user is resizing the Note.
   */
  const onResizeNote = useCallback(
    (e: React.PointerEvent) => {
      if (!resizing.current || !noteRef.current || !boardRef.current) return;


      const boardRect = boardRef.current.getBoundingClientRect();
      const noteRect = noteRef.current.getBoundingClientRect()


      const nextWidth = initialPosition.current.width + (e.clientX - initialPosition.current.x);
      const nextHeight = initialPosition.current.height + (e.clientY - initialPosition.current.y);


      const widthAvailableOffset = boardRect.width - noteRect.left;
      const heightAvailableOffset = boardRect.height - noteRect.top;

      const width = Math.max(
        STICKY_NOTE_MIN_WIDTH,
        Math.min(
          nextWidth,
          Math.min(widthAvailableOffset, STICKY_NOTE_MAX_WIDTH)
        )
      )

      const height = Math.max(
        STICKY_NOTE_MIN_HEIGHT,
        Math.min(
          nextHeight,
          Math.min(heightAvailableOffset, STICKY_NOTE_MAX_WIDTH)
        )
      )

      // Update the DOM directly for better performance
      noteRef.current.style.width = `${width}px`;
      noteRef.current.style.height = `${height}px`;
    },
    [noteRef, boardRef],
  );

  /**
   * Executed when the user stops resizing the Note (drop resize handler).
   */
  const onResizeNoteEnd = useCallback(
    (e: React.PointerEvent) => {
      if (!resizing.current || !noteRef.current) return;
      resizing.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);

      // Get the final size of the DOM element
      const rect = noteRef.current.getBoundingClientRect();
      const note = useNotesStore.getState().notes[id];

      if (!note) return;

      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      // Update only if the size has changed.
      if (note?.size?.width !== width || note?.size?.height !== height) {
        updateNote(id, {
          size: { width, height },
        });
      }
    },
    [id, updateNote, noteRef],
  );

  return { onStartResizeNote, onResizeNote, onResizeNoteEnd };
}
