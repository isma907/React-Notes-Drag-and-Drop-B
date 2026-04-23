import { useRef, useCallback } from "react";
import { useNotesStore } from "../store/useNotes";

export function useDrag(
  id: string,
  noteRef: React.RefObject<HTMLDivElement | null>,
  trashRef: React.RefObject<HTMLDivElement | null>,
) {
  const note = useNotesStore((s) => s.notes[id]);
  const updateNote = useNotesStore((s) => s.updateNote);
  const removeNote = useNotesStore((s) => s.removeNote);
  const bringToFront = useNotesStore((s) => s.bringToFront);

  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });
  const initialPosition = useRef({ x: 0, y: 0 });

  const onStartDragNote = useCallback(
    (e: React.PointerEvent) => {
      if (!note) return;

      bringToFront(id);
      isDragging.current = true;
      offset.current = {
        x: e.clientX - note.position.x,
        y: e.clientY - note.position.y,
      };

      position.current = { ...note.position };
      initialPosition.current = { ...note.position };

      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [bringToFront, id, note],
  );

  const onDragNote = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || !noteRef.current) return;

      const x = e.clientX - offset.current.x;
      const y = e.clientY - offset.current.y;
      position.current = { x, y };
      noteRef.current.style.left = `${x}px`;
      noteRef.current.style.top = `${y}px`;
    },
    [noteRef],
  );

  const onDropNote = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
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
        const confirmed = window.confirm(
          "Are you sure, you want to delete this note?",
        );
        if (confirmed) {
          removeNote(note.id);
          return;
        } else {
          // Restore to initial position if user cancel the action
          if (noteRef.current) {
            noteRef.current.style.left = `${initialPosition.current.x}px`;
            noteRef.current.style.top = `${initialPosition.current.y}px`;
          }
          updateNote(id, { position: initialPosition.current });
          return;
        }
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
  }, [id, note, updateNote, removeNote, trashRef, noteRef]);

  return {
    onStartDragNote,
    onDragNote,
    onDropNote,
  };
}
