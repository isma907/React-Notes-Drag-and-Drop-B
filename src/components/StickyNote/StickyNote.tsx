import { useNotesStore } from '../../store/useNotes';
import './StickyNote.css'
const StickyNote = ({ id }: { id: string }) => {

    const note = useNotesStore((s) => s.notes[id]);

    return (
        <article className="sticky-note" style={{ width: note.size?.width, height: note.size?.height, left: note.position.x, top: note.position.y, backgroundColor: note.backgroundColor }}>
            <textarea className="sticky-note_text-content" placeholder="Write your note here..." value={note.textContent} />
        </article>
    )
}

export default StickyNote
