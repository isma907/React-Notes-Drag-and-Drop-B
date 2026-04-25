import React, { use, useCallback, useRef, useState } from "react";
import { useNotesStore } from "../../store/useNotes";
import { useDrag } from "../../hooks/useDrag";
import { useResize } from "../../hooks/useResize";
import { BoardContext } from "../../context/boardContext";
import { GripHorizontal } from "lucide-react";
import "./StickyNote.css";

const StickyNote = ({ id }: { id: string }) => {
  const note = useNotesStore((s) => s.notes.find((note) => note.id === id));
  const noteRef = useRef<HTMLDivElement>(null);
  const { trashRef } = use(BoardContext)!;

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
    const current =
      useNotesStore.getState().notes.find((note) => note.id === id)
        ?.textContent ?? "";

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
        zIndex: note.zIndex,
      }}
      ref={noteRef}
    >
      <div
        className="sticky-note-drag-handler"
        onPointerDown={onStartDragNote}
        onPointerMove={onDragNote}
        onPointerUp={onDropNote}
      >
        <span className="sticky-note-drag-handler-icon">
          <GripHorizontal />
        </span>
      </div>
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

export default React.memo(StickyNote);
