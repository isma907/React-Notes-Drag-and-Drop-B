import { useRef, useCallback } from "react";
import { useNotesStore } from "../store/useNotes";

/**
 * Custom hook to handle the drag&drop logic of a Note.
 * @param id - The unique ID of the Note.
 * @param noteRef - Reference to the Note DOM element.
 * @param trashRef - Reference to the Trash DOM element (to detect collision).
 * @param boardRef - Reference to the Board DOM element (to enforce boundaries).
 */
export function useDrag(
  id: string,
  noteRef: React.RefObject<HTMLDivElement | null>,
  trashRef: React.RefObject<HTMLDivElement | null>,
  boardRef: React.RefObject<HTMLDivElement | null>,
) {
  const updateNote = useNotesStore((s) => s.updateNote);
  const bringToFront = useNotesStore((s) => s.bringToFront);
  const removeNote = useNotesStore((s) => s.removeNote);

  const isDragging = useRef(false);

  const offset = useRef({ x: 0, y: 0 }); // Distance between the cursor and the top-left corner of the Note
  const position = useRef({ x: 0, y: 0 }); // Current position during drag.
  const initialPosition = useRef({ x: 0, y: 0 }); // Position before drag starts.

  /**
   * Executed on pressing the drag handler (Start draging the Note).
   */
  const onStartDragNote = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return; // pressed left click only
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
      let x = e.clientX - offset.current.x;
      let y = e.clientY - offset.current.y;

      // Boundaries enforcement
      if (boardRef?.current && noteRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        const noteRect = noteRef.current.getBoundingClientRect();
        const maxX = boardRect.width - noteRect.width;
        const maxY = boardRect.height - noteRect.height;
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
      }

      position.current = { x, y };

      // Update the DOM directly using transform for better performance
      noteRef.current.style.transform = `translate(${x}px, ${y}px)`;

      // Visual feedback for trash zone
      if (trashRef?.current) {
        const trashRect = trashRef.current.getBoundingClientRect();
        const noteRect = noteRef.current.getBoundingClientRect();
        
        const isOverTrash =
          noteRect.left < trashRect.right &&
          noteRect.right > trashRect.left &&
          noteRect.top < trashRect.bottom &&
          noteRect.bottom > trashRect.top;

        if (isOverTrash) {
          trashRef.current.classList.add("trash-active");
          noteRef.current.classList.add("note-over-trash");
        } else {
          trashRef.current.classList.remove("trash-active");
          noteRef.current.classList.remove("note-over-trash");
        }
      }
    },
    [noteRef, trashRef, boardRef],
  );

  /**
   * Executed on releasing the mouse after dragging (Droping the Note).
   */
  const onDropNote = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);

      const note = useNotesStore.getState().notes.find((note) => note.id === id);

      if (!note) return;

      if (trashRef.current && noteRef.current) {
        trashRef.current.classList.remove("trash-active");
        noteRef.current.classList.remove("note-over-trash");

        const trashRect = trashRef.current.getBoundingClientRect();
        const noteRect = noteRef.current.getBoundingClientRect();

        // Check if we dropped the note into Trash FIRST
        const isOverTrash =
          noteRect.left < trashRect.right &&
          noteRect.right > trashRect.left &&
          noteRect.top < trashRect.bottom &&
          noteRect.bottom > trashRect.top;

        if (isOverTrash) {
          removeNote(note.id);
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
    },
    [id, noteRef, trashRef, removeNote, updateNote],
  );

  return {
    onStartDragNote,
    onDragNote,
    onDropNote,
  };
}
