import { useRef, useCallback } from "react";
import { useNotesStore } from "../store/useNotes";
import type {
    StickyNotePosition,
} from "../interfaces/StickyNote";
import { MIN_DRAG_CREATION_WIDTH, MIN_DRAG_CREATION_HEIGHT } from "../constants/stickyNotes.constants";

/**
 * Custom hook to handle Create by dragging in board.
 * @param boardRef - Reference to the Board DOM element (to enforce boundaries).
 */
export function useDragCreate(
    boardRef: React.RefObject<HTMLDivElement | null>,
    dragGuideLinesRef: React.RefObject<HTMLDivElement | null>,
) {
    const createNote = useNotesStore((s) => s.createNote);
    const isDraggingCreation = useRef(false);
    const initialPosition = useRef<StickyNotePosition>({ x: 0, y: 0 });

    /**
     * Executed on start pressing Board.
     */
    const onDragCreate = useCallback(
        (e: React.PointerEvent) => {
            if (!dragGuideLinesRef.current || !boardRef.current || e.button !== 0) return
            const target = e.target as HTMLElement;
            const isBoard = target.classList.contains("board")
            if (!isBoard) return;
            dragGuideLinesRef.current.style.width = "0px";
            dragGuideLinesRef.current.style.height = "0px";
            dragGuideLinesRef.current.style.left = "0px";
            dragGuideLinesRef.current.style.top = "0px";
            isDraggingCreation.current = true;
            initialPosition.current = { x: e.clientX, y: e.clientY }
            e.currentTarget.setPointerCapture(e.pointerId);
        },
        [boardRef, dragGuideLinesRef],
    );


    const onHoldDragCreate = useCallback((e: React.PointerEvent) => {
        if (!isDraggingCreation.current || !dragGuideLinesRef.current) return;

        const { x: initialX, y: initialY } = initialPosition.current;

        const currentX = e.clientX;
        const currentY = e.clientY;

        const left = Math.min(initialX, currentX);
        const top = Math.min(initialY, currentY);

        const width = Math.abs(initialX - currentX);
        const height = Math.abs(initialY - currentY);

        dragGuideLinesRef.current.style.display = "block";
        if (width < MIN_DRAG_CREATION_WIDTH || height < MIN_DRAG_CREATION_HEIGHT) {
            dragGuideLinesRef.current.classList.add("not-allowed")
        }
        else {
            dragGuideLinesRef.current.classList.remove("not-allowed")
        }

        const guide = dragGuideLinesRef.current;
        guide.style.left = `${left}px`;
        guide.style.top = `${top}px`;
        guide.style.width = `${width}px`;
        guide.style.height = `${height}px`;
    }, [dragGuideLinesRef]);


    /**
     * Executed on releasing the mouse after dragging creation(Dropping Mouse).
     */
    const onDropCreate = useCallback((e: React.PointerEvent) => {
        if (!isDraggingCreation.current || !boardRef.current || !dragGuideLinesRef.current) return;

        const boardRect = boardRef.current.getBoundingClientRect();

        const startX = initialPosition.current.x - boardRect.left;
        const startY = initialPosition.current.y - boardRect.top;

        const endX = e.clientX - boardRect.left;
        const endY = e.clientY - boardRect.top;

        const left = Math.min(startX, endX);
        const top = Math.min(startY, endY);

        let width = Math.abs(startX - endX);
        let height = Math.abs(startY - endY);

        const clampedLeft = Math.max(0, left);
        const clampedTop = Math.max(0, top);

        width = Math.min(width, boardRect.width - clampedLeft);
        height = Math.min(height, boardRect.height - clampedTop);

        if (
            width > MIN_DRAG_CREATION_WIDTH &&
            height > MIN_DRAG_CREATION_HEIGHT
        ) {
            createNote(
                {
                    x: clampedLeft,
                    y: clampedTop,
                },
                {
                    width,
                    height,
                }
            );
        }

        isDraggingCreation.current = false;

        dragGuideLinesRef.current.style.display = "none";

        e.currentTarget.releasePointerCapture(e.pointerId);
    }, [boardRef, dragGuideLinesRef, createNote]);

    return {
        onDragCreate,
        onHoldDragCreate,
        onDropCreate,
    };
}
