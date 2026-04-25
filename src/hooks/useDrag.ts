import { useRef, useCallback } from "react";
import { useNotesStore } from "../store/useNotes";

/**
 * Custom hook to handle the drag&drop logic of a Note.
 * @param id - The unique ID of the Note.
 * @param noteRef - Reference to the Note DOM element.
 * @param trashRef - Reference to the Trash DOM element (to detect collision).
 */
export function useDrag(
  id: string,
  noteRef: React.RefObject<HTMLDivElement | null>,
  trashRef: React.RefObject<HTMLDivElement | null>,
) {
  const updateNote = useNotesStore((s) => s.updateNote);
  const bringToFront = useNotesStore((s) => s.bringToFront);
  const setPendingDeleteNoteId = useNotesStore((s) => s.setPendingDeleteNoteId);

  const isDragging = useRef(false);

  const offset = useRef({ x: 0, y: 0 }); // Distance between the cursor and the top-left corner of the Note
  const position = useRef({ x: 0, y: 0 }); // Current position during drag.
  const initialPosition = useRef({ x: 0, y: 0 }); // Position before drag starts.

  /**
   * Executed on pressing the drag handler (Start draging the Note).
   */
  const onStartDragNote = useCallback(
    (e: React.PointerEvent) => {
      const note = useNotesStore
        .getState()
        .notes.find((note) => note.id === id);

      if (!note) return;

      bringToFront(id);
      isDragging.current = true;

      // Calculate the offset - (distance between the cursor and the top-left corner of the Note)
      offset.current = {
        x: e.clientX - note.position.x,
        y: e.clientY - note.position.y,
      };

      position.current = { ...note.position };
      initialPosition.current = { ...note.position };

      // Capture the pointer so movement is detected even if it leaves the Note
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [bringToFront, id],
  );

  /**
   * Executed while the user drags the Note.
   */
  const onDragNote = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !noteRef.current) return;

      // Calculate the new position by subtracting the initial offset
      const x = e.clientX - offset.current.x;
      const y = e.clientY - offset.current.y;
      position.current = { x, y };

      // Update the DOM directly for smooth performance (no React re-renders)
      noteRef.current.style.left = `${x}px`;
      noteRef.current.style.top = `${y}px`;
    },
    [noteRef],
  );

  /**
   * Executed on releasing the mouse after dragging (Droping the Note).
   */
  const onDropNote = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const note = useNotesStore.getState().notes.find((note) => note.id === id);

    if (!note) return;

    if (trashRef.current && noteRef.current) {
      const trashRect = trashRef.current.getBoundingClientRect();
      const noteRect = noteRef.current.getBoundingClientRect();

      // Check if we dropped the note into Trash FIRST
      const isOverTrash =
        noteRect.left < trashRect.right &&
        noteRect.right > trashRect.left &&
        noteRect.top < trashRect.bottom &&
        noteRect.bottom > trashRect.top;

      if (isOverTrash) {
        noteRef.current.style.left = `${initialPosition.current.x}px`;
        noteRef.current.style.top = `${initialPosition.current.y}px`;
        setPendingDeleteNoteId(note.id);
        return;
      }

      // Normal drop - update position only if changed
      else {
        const hasChanged =
          note.position.x !== position.current.x ||
          note.position.y !== position.current.y;

        if (hasChanged) {
          updateNote(id, {
            position: position.current,
          });
        }
      }
    }
  }, [id, noteRef, trashRef, setPendingDeleteNoteId, updateNote]);

  return {
    onStartDragNote,
    onDragNote,
    onDropNote,
  };
}
