import { useCallback, useRef, useState } from "react";
import { useNotesStore } from "../../store/useNotes";
import "./StickyNote.css";
import { useDrag } from "../../hooks/userDrag";
import { useBoardContext } from "../../context/BoardContext";
import { useResize } from "../../hooks/useResize";

const StickyNote = ({ id, zIndex }: { id: string; zIndex: number }) => {
  const note = useNotesStore((s) => s.notes[id]);
  const noteRef = useRef<HTMLDivElement>(null);
  const { trashRef } = useBoardContext();

  const { onStartDragNote, onDragNote, onDropNote } = useDrag(
    id,
    noteRef,
    trashRef,
  );
  const { onStartResizeNote, onResizeNote, onResizeNoteEnd } = useResize(
    id,
    noteRef,
  );

  const updateNote = useNotesStore((s) => s.updateNote);
  const [noteValue, setNoteValue] = useState(note?.textContent ?? "");

  const handleUpdateText = useCallback(() => {
    const current = note?.textContent ?? "";
    //Update store only if there is a change in the content
    if (noteValue !== current) {
      updateNote(id, { textContent: noteValue });
    }
  }, [id, noteValue, updateNote]);

  if (!note) {
    return null;
  }

  return (
    <article
      className="sticky-note"
      style={{
        width: note.size?.width,
        height: note.size?.height,
        left: note.position.x,
        top: note.position.y,
        backgroundColor: note.backgroundColor,
        zIndex,
      }}
      ref={noteRef}
    >
      <div
        className="sticky-note-drag-handler"
        onPointerDown={onStartDragNote}
        onPointerMove={onDragNote}
        onPointerUp={onDropNote}
      ></div>
      <textarea
        className="sticky-note_text-content"
        placeholder="Write your note here..."
        value={noteValue}
        onChange={(e) => setNoteValue(e.target.value)}
        onBlur={handleUpdateText}
      />

      <div
        className="sticky-note-resize-handler"
        onPointerDown={onStartResizeNote}
        onPointerMove={onResizeNote}
        onPointerUp={onResizeNoteEnd}
      ></div>
    </article>
  );
};

export default StickyNote;
