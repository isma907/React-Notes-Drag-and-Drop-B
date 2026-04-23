import { useCallback, useRef, useState } from 'react';
import { useNotesStore } from '../../store/useNotes';
import './StickyNote.css'
import { useDrag } from '../../hooks/userDrag';
const StickyNote = ({ id }: { id: string }) => {

    const note = useNotesStore((s) => s.notes[id]);
    const noteRef = useRef<HTMLDivElement>(null);

    const { onPointerDown, onPointerMove, onPointerUp } = useDrag(id, noteRef);

    const updateNote = useNotesStore((s) => s.updateNote);
    const [noteValue, setNoteValue] = useState(note?.textContent ?? "");

    const handleUpdateText = useCallback(() => {
        const current = note?.textContent ?? "";
        //Update store only if there is a change in the content
        if (noteValue !== current) {
            updateNote(id, { textContent: noteValue });
        }
    }, [id, noteValue, updateNote]);

    return (
        <article className="sticky-note"
            style={{ width: note.size?.width, height: note.size?.height, left: note.position.x, top: note.position.y, backgroundColor: note.backgroundColor }}
            ref={noteRef}
        >
            <div className="sticky-note-drag-handle" onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}></div>
            <textarea className="sticky-note_text-content" placeholder="Write your note here..."
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                onBlur={handleUpdateText}
            />
        </article>
    )
}

export default StickyNote
