import { useCallback, useRef, memo } from "react";
import { useShallow } from "zustand/react/shallow";
import StickyNote from "../StickyNote/StickyNote";
import { useNotesStore } from "../../store/useNotes";
import { Trash2 } from "lucide-react";
import { BoardProvider } from "../../context/BoardProvider";
import { UndoToast } from "../UndoToast/UndoToast";
import "./Board.css";
import { ToolBar } from "../ToolBar/ToolBar";
import { useDragCreate } from "../../hooks/useDragCreate";

const Board = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const dragGuideLinesRef = useRef<HTMLDivElement>(null);
  const { onDragCreate, onDropCreate, onHoldDragCreate } = useDragCreate(boardRef, dragGuideLinesRef)
  const createNote = useNotesStore((state) => state.createNote);

  /**
   * Create a new note on double clicking in an empty space on the board.
   */
  const handleAddNote = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget || !boardRef.current) return;

      const rect = boardRef.current.getBoundingClientRect();

      const { width, height } = useNotesStore.getState().toolbarConfig

      // Calculate x and y such that the click is the center of the note
      let x = e.clientX - rect.left - width / 2;
      let y = e.clientY - rect.top - height / 2;

      // Bound coordinates so the new note doesn't overflow the board
      const maxX = Math.max(0, rect.width - width);
      const maxY = Math.max(0, rect.height - height);

      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      createNote({ x, y });
    },
    [createNote],
  );


  return (
    <BoardProvider trashRef={trashRef} boardRef={boardRef}>
      <section className="board" ref={boardRef} onDoubleClick={handleAddNote}
        onPointerDown={onDragCreate}
        onPointerUp={onDropCreate}
        onPointerMove={onHoldDragCreate}

      >
        <div className="trash-item" ref={trashRef}>
          <Trash2 size={60} />
        </div>
        <NotesList />
        <ToolBar />

        <div ref={dragGuideLinesRef} className="drag-create-guidelines"></div>
      </section>
      <UndoToast />
    </BoardProvider>
  );
};
export default Board;

const NotesList = memo(() => {
  const noteIds = useNotesStore(useShallow((s) => Object.keys(s.notes)));
  return (
    <>
      {noteIds.map((id) => (
        <StickyNote key={id} id={id} />
      ))}
    </>
  );
});
