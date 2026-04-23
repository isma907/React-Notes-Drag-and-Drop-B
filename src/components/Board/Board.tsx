import { useRef } from "react";
import StickyNote from "../StickyNote/StickyNote";
import "./Board.css";
import { useNotesStore } from "../../store/useNotes";
import { createStickyNote } from "../../utils/stickyNotes.utils";
import { FaRegTrashCan } from "react-icons/fa6";
import { BoardProvider } from "../../context/BoardContext";

const Board = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const addNote = useNotesStore((state) => state.addNote);

  const noteIds = useNotesStore((s) => s.noteOrder);

  /**
    / Create a new note on doubleClicking in an empty space on the board
     */
  const handleAddNote = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    const rect = boardRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);

    const newStickyNote = createStickyNote({ x, y });
    addNote(newStickyNote);
  };

  return (
    <BoardProvider trashRef={trashRef}>
      <section className="board" ref={boardRef} onDoubleClick={handleAddNote}>
        <div className="trash-item" ref={trashRef}>
          <FaRegTrashCan />
        </div>
        {noteIds.map((id, index) => (
          <StickyNote key={id} id={id} zIndex={index + 1} />
        ))}
      </section>
    </BoardProvider>
  );
};

export default Board;
