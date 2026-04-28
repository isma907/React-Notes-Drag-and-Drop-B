import { useCallback, useRef, memo } from "react";
import { useShallow } from "zustand/react/shallow";
import StickyNote from "../StickyNote/StickyNote";
import { useNotesStore } from "../../store/useNotes";
import { Trash2 } from "lucide-react";
import { BoardProvider } from "../../context/BoardProvider";
import { UndoToast } from "../UndoToast/UndoToast";
import "./Board.css";
import { ToolBar } from "../ToolBar/ToolBar";

const Board = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const createNote = useNotesStore((state) => state.createNote);
  const toolbarConfig = useNotesStore((state) => state.toolbarConfig);

  /**
   * Create a new note on double clicking in an empty space on the board.
   */
  const handleAddNote = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget || !boardRef.current) return;

      const rect = boardRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // Bound coordinates so the new note doesn't overflow the board
      const maxX = Math.max(0, rect.width - toolbarConfig.width);
      const maxY = Math.max(0, rect.height - toolbarConfig.height);

      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      createNote({ x, y });
    },
    [createNote, toolbarConfig],
  );

  return (
    <BoardProvider trashRef={trashRef} boardRef={boardRef}>
      <section className="board" ref={boardRef} onDoubleClick={handleAddNote}>
        <div className="trash-item" ref={trashRef}>
          <Trash2 size={60} />
        </div>
        <NotesList />
        <ToolBar />
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
