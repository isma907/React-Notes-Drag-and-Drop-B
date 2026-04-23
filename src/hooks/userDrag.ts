import { useRef, useCallback } from "react";
import { useNotesStore } from "../store/useNotes";

export function useDrag(id: string, noteRef: React.RefObject<HTMLDivElement | null>) {
    const updateNote = useNotesStore((s) => s.updateNote);

    const isDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const position = useRef({ x: 0, y: 0 });

    const onStartDragNote = useCallback((e: React.PointerEvent) => {
        const note = useNotesStore.getState().notes[id];
        if (!note) return;
        isDragging.current = true;
        offset.current = {
            x: e.clientX - note.position.x,
            y: e.clientY - note.position.y,
        };

        position.current = { ...note.position };

        e.currentTarget.setPointerCapture(e.pointerId);
    }, [id]);

    const onDragNote = useCallback((e: React.PointerEvent) => {
        if (!isDragging.current || !noteRef.current) return;
        const x = e.clientX - offset.current.x;
        const y = e.clientY - offset.current.y;
        position.current = { x, y };
        noteRef.current.style.left = `${x}px`;
        noteRef.current.style.top = `${y}px`;
    }, [noteRef]);

    const onDropNote = useCallback(() => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const current = useNotesStore.getState().notes[id];
        if (!current) return;
        const hasChanged =
            current.position.x !== position.current.x ||
            current.position.y !== position.current.y;

        if (hasChanged) {
            updateNote(id, {
                position: position.current,
            });
        }

    }, [id, updateNote]);

    return {
        onStartDragNote,
        onDragNote,
        onDropNote,
    };
}