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
  const isDraggingOverTrash = useRef(false);

  const offset = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });
  const initialPosition = useRef({ x: 0, y: 0 });
  const noteSize = useRef({ width: 0, height: 0 });
  const boardSize = useRef({ width: 0, height: 0 });

  const isOverTrash = useCallback(() => {
    if (!trashRef.current || !noteRef.current) return false;

    const trashRect = trashRef.current.getBoundingClientRect();
    const noteRect = noteRef.current.getBoundingClientRect();

    return (
      noteRect.left < trashRect.right &&
      noteRect.right > trashRect.left &&
      noteRect.top < trashRect.bottom &&
      noteRect.bottom > trashRect.top
    );
  }, [trashRef, noteRef]);

  const addTrashClasses = useCallback(() => {
    trashRef.current?.classList.add("trash-active");
    noteRef.current?.classList.add("note-over-trash");
  }, [trashRef, noteRef]);

  const removeTrashClasses = useCallback(() => {
    trashRef.current?.classList.remove("trash-active");
    noteRef.current?.classList.remove("note-over-trash");
  }, [trashRef, noteRef]);

  /**
   * Executed on pressing the drag handler (Start draging the Note).
   */
  const onStartDragNote = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      if (!noteRef.current) return;

      const note = useNotesStore.getState().notes.find((n) => n.id === id);

      if (!note) return;

      bringToFront(id);
      isDragging.current = true;

      // Calculate the offset - (distance between the cursor and the top-left corner of the Note)
      const noteRect = noteRef.current.getBoundingClientRect();
      noteSize.current = {
        width: noteRect.width,
        height: noteRect.height,
      };

      if (boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        boardSize.current = {
          width: boardRect.width,
          height: boardRect.height,
        };
      }

      offset.current = {
        x: e.clientX - note.position.x,
        y: e.clientY - note.position.y,
      };

      position.current = { ...note.position };
      initialPosition.current = { ...note.position };

      // Capture the pointer so movement is detected even if it leaves the Note
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [bringToFront, id, noteRef, boardRef],
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
      if (boardRef.current) {
        const maxX = boardSize.current.width - noteSize.current.width;
        const maxY = boardSize.current.height - noteSize.current.height;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
      }

      position.current = { x, y };

      // Update the DOM directly using transform for better performance
      noteRef.current.style.transform = `translate(${x}px, ${y}px)`;

      // Trash detection for note deletion
      if (trashRef.current) {
        const over = isOverTrash();

        if (over && !isDraggingOverTrash.current) {
          addTrashClasses();
          isDraggingOverTrash.current = true;
        } else if (!over && isDraggingOverTrash.current) {
          removeTrashClasses();
          isDraggingOverTrash.current = false;
        }
      }
    },
    [
      noteRef,
      trashRef,
      boardRef,
      isOverTrash,
      addTrashClasses,
      removeTrashClasses,
    ],
  );

  /**
   * Executed on releasing the mouse after dragging (Droping the Note).
   */
  const onDropNote = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);

      const note = useNotesStore.getState().notes.find((n) => n.id === id);

      if (!note) return;
      const overTrash = isOverTrash();
      removeTrashClasses();
      isDraggingOverTrash.current = false;

      if (overTrash) {
        removeNote(note.id);
        return;
      }

      const hasChanged =
        note.position.x !== position.current.x ||
        note.position.y !== position.current.y;

      if (hasChanged) {
        updateNote(id, {
          position: position.current,
        });
      }
    },
    [id, removeNote, updateNote, isOverTrash, removeTrashClasses],
  );

  return {
    onStartDragNote,
    onDragNote,
    onDropNote,
  };
}
