import { useCallback, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import StickyNote from "../StickyNote/StickyNote";
import "./Board.css";
import { useNotesStore } from "../../store/useNotes";
import { createStickyNote } from "../../utils/stickyNotes.utils";
import { FaRegTrashCan } from "react-icons/fa6";
import { BoardProvider } from "../../context/BoardProvider";
import DeleteNoteModal from "../DeleteNoteModal/DeleteNoteModal";

const Board = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const addNote = useNotesStore((state) => state.addNote);

  const notes = useNotesStore(
    useShallow((s) => s.notes.map((note) => note.id)),
  );

  /**
    / Create a new note on doubleClicking in an empty space on the board
     */
  const handleAddNote = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return;
      const rect = boardRef.current?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);

      const { lastZIndex } = useNotesStore.getState();
      const newStickyNote = createStickyNote({ x, y }, lastZIndex + 1);
      addNote(newStickyNote);
    },
    [addNote],
  );

  return (
    <BoardProvider trashRef={trashRef}>
      <section className="board" ref={boardRef} onDoubleClick={handleAddNote}>
        <div className="trash-item" ref={trashRef}>
          <FaRegTrashCan />
        </div>

        {notes.map((id) => (
          <StickyNote key={id} id={id} />
        ))}
      </section>
      <DeleteNoteModal />
    </BoardProvider>
  );
};

export default Board;
