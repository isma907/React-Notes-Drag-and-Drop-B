import { useRef, useCallback } from "react";
import { useNotesStore } from "../store/useNotes";
import {
  STICKY_NOTE_MIN_HEIGHT,
  STICKY_NOTE_MIN_WIDTH,
} from "../constants/stickyNotes.constants";

export function useResize(
  id: string,
  noteRef: React.RefObject<HTMLDivElement | null>,
) {
  const updateNote = useNotesStore((s) => s.updateNote);
  const bringToFront = useNotesStore((s) => s.bringToFront);

  const resizing = useRef(false);
  const start = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const onStartResizeNote = useCallback(
    (e: React.PointerEvent) => {
      const note = useNotesStore.getState().notes[id];
      if (!note) return;
      bringToFront(id);
      resizing.current = true;
      start.current = {
        x: e.clientX,
        y: e.clientY,
        w: note?.size?.width ?? STICKY_NOTE_MIN_WIDTH,
        h: note?.size?.height ?? STICKY_NOTE_MIN_HEIGHT,
      };

      e.currentTarget.setPointerCapture(e.pointerId);
      e.stopPropagation();
    },
    [bringToFront, id],
  );

  const onResizeNote = useCallback(
    (e: React.PointerEvent) => {
      if (!resizing.current || !noteRef.current) return;

      //Check with minHeight and minWidth to avoid resizing too small
      const width = Math.max(
        STICKY_NOTE_MIN_WIDTH,
        start.current.w + (e.clientX - start.current.x),
      );
      const height = Math.max(
        STICKY_NOTE_MIN_HEIGHT,
        start.current.h + (e.clientY - start.current.y),
      );

      noteRef.current.style.width = `${width}px`;
      noteRef.current.style.height = `${height}px`;
    },
    [noteRef],
  );

  const onResizeNoteEnd = useCallback(() => {
    if (!resizing.current || !noteRef.current) return;
    resizing.current = false;

    const rect = noteRef.current.getBoundingClientRect();

    const note = useNotesStore.getState().notes[id];
    if (!note) return;
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    if (note?.size?.width !== width || note?.size?.height !== height) {
      updateNote(id, {
        size: { width, height },
      });
    }
  }, [id, updateNote, noteRef]);

  return { onStartResizeNote, onResizeNote, onResizeNoteEnd };
}
