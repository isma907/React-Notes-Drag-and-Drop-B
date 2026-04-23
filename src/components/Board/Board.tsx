import { useRef } from 'react'
import StickyNote from '../StickyNote/StickyNote'
import './Board.css'
import { useNotesStore } from '../../store/useNotes'
import { useShallow } from 'zustand/react/shallow'
import { generateColor } from '../../utils/stickyNotes.utils'
import { FaRegTrashCan } from "react-icons/fa6";
const Board = () => {
    const boardRef = useRef<HTMLDivElement>(null)
    const addNote = useNotesStore((state) => state.addNote);


    const noteIds = useNotesStore(
        useShallow((s) => Object.keys(s.notes)),
    );

    /**
    / Create a new note on doubleClicking an empty space on the board
     */
    const handleAddNote = (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget) return;
        console.log("adding note")
        const rect = boardRef.current?.getBoundingClientRect()
        const x = e.clientX - (rect?.left || 0)
        const y = e.clientY - (rect?.top || 0);
        addNote({ id: crypto.randomUUID(), textContent: "", position: { x, y }, backgroundColor: generateColor(), size: { width: 200, height: 200 } })
    }

    return (
        <section className="board" ref={boardRef}
            onDoubleClick={handleAddNote}>
            <div className='trash-item'>
                <FaRegTrashCan />
            </div>
            {noteIds.map((id) => (
                <StickyNote key={id} id={id} />
            ))}
        </section>
    )
}

export default Board
